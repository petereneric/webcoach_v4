import {AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Unit} from "../../../../interfaces/unit";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Communication} from "../../../../services/communication/communication.service";
import * as videojs from "video.js";
import {interval, Subscription, timeout} from "rxjs";
import {WebinarService} from "../../../../services/data/webinar.service";
import {AnimationService} from "../../../../services/animation.service";
import {environment} from "../../../../../environments/environment";
import * as Hammer from 'hammerjs';
import {CoachService} from "../../../../services/data/coach.service";
import {environment2} from "../../../../../environments/environment.dev";
import {MainMenuService} from "../../../../services/menu/main-menu.service";
import {ListSliderComponent} from "../../../../components/list-slider/list-slider.component";
import {Note} from "../../../../interfaces/note";
import {ListActionComponent} from "../../../../components/list-action/list-action.component";
import {DateTime} from "../../../../utils/date-time";
import {ListInputComponent} from "../../../../components/list-input/list-input.component";

@Component({
  selector: 'app-webinar-vert',
  templateUrl: './webinar-vert.page.html',
  styleUrls: ['./webinar-vert.page.scss'],
  providers: [MainMenuService, DateTime],
})
export class WebinarVertPage implements OnInit, AfterViewInit, OnDestroy {

  // view-children
  @ViewChild('vSwipe') vSwipe!: ElementRef
  @ViewChild('videoWrapper') videoWrapper!: ElementRef
  @ViewChild('videoBottom') videoBottom!: ElementRef
  @ViewChild('videoTop') videoTop!: ElementRef
  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vListOutside') vListOutside!: ElementRef
  @ViewChild('vListInside') vListInside!: ElementRef
  @ViewChild('vListHeader') vListHeader!: ElementRef
  @ViewChild('vProcess') vProcess!: ElementRef
  @ViewChild('vTabs') vTabs!: ElementRef
  @ViewChild('vCover') vCover!: ElementRef
  @ViewChild('vPlay') vPlay!: ElementRef
  @ViewChild('vPause') vPause!: ElementRef
  @ViewChild('vTitle') vTitle!: ElementRef
  @ViewChild('vInformation') vInformation!: ElementRef
  @ViewChild('vSidebar') vSidebar!: ElementRef
  @ViewChild('vListInsideNotes') vListInsideNotes!: ElementRef
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined
  @ViewChild('cpListActionNotes') cpListActionNotes!: ListActionComponent
  @ViewChild('cpListInputAddNote') cpListInputAddNote!: ListInputComponent
  @ViewChild('cpListInputEditNote') cpListInputEditNote!: ListInputComponent
  @ViewChild('vInputNote') vInputNote!: ElementRef
  @ViewChild('vInputNoteContainer') vInputNoteContainer!: ElementRef

  // output
  @Output('long-press') onPress: EventEmitter<any> = new EventEmitter()
  @Output('long-press-up') onPressUp: EventEmitter<any> = new EventEmitter()

  // constants
  readonly THRESHOLD_COVER_SCROLL = 3
  readonly THRESHOLD_VIDEO_VELOCITY = 0.25 // px/ms
  readonly THRESHOLD_LIST_VELOCITY = 1.5 // px/ms
  readonly THRESHOLD_LIST_HEADER_VELOCITY = 0.30 // px/ms
  readonly THRESHOLD_LIST_INSIDE_VELOCITY = 0.30 // px/ms
  readonly TRANSITION_VIDEO_SWIPE = 0.35 // s
  readonly TRANSITION_LIST_SWIPE = environment.TRANSITION_LIST_SWIPE // s
  readonly TRANSITION_LIST_CLOSE = 1 // s
  readonly INTERVAL_PROCESS_UPDATER = 100 // ms
  readonly DIRECTION_LIST_START_UP = 1
  readonly DIRECTION_LIST_START_DOWN = 2
  readonly TIME_INFORMATION_START = 5 // sec
  readonly TIME_SIDEBAR_END = 10 // sec

  // tracker for list of units
  private bListOpen = false

  // gets changed in function setHeight()
  private hVideoWrapper = 0

  // needed for process
  private wWindow = 0

  // set when pan movement of list is started
  // works with deltaY as scroll reference for new topList
  private offsetTopListStart = 0

  // TODO description
  private offsetTopListInsideStart = 0
  private heightList = 0
  public hWindow = 0
  private hListOutside = 0
  private bClickListInsideDisabled = true
  private bScrollListInsideEnabled = false
  private bSidebarShown = false
  private bSidebarHidden = false
  private bInformationShown = false
  private bInformationHidden = false
  private bVisibilityChange = false

  aContent: any | null = null

  // data object for heights of section and unit
  public aHeights = {pxHeightSection: 0, pxHeightUnit: 0}

  // black line at the top due to IOS pixel line before first scroll
  public bShowBlackLineTop = true

  // used to respect threshold only in the beginning of the scroll
  private tDirectionListStart = 0

  // becomes true when the player is played the first time
  private bDocumentInteraction = false

  // disabled when scrolling up
  private bScrollDisabled = false

  // counter as trigger for hiding cover
  private nScroll = 0

  // stop checker by variable when process bar moved by user
  private bStopProcessUpdater = false

  // player
  player!: videojs.default.Player;

  // process tracks the time the video has played in relation to its full time
  // and updates the ui process bar
  process!: Subscription;

  constructor(public uDateTime: DateTime, private svMenu: MainMenuService, private svCoach: CoachService, private router: Router, private svAnimation: AnimationService, public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    // get kWebinar and start service that loads webinar
    this.activatedRoute.params.subscribe(params => {
      const kWebinar = params['kWebinar'];
      this.svWebinar.load(kWebinar);
      this.svWebinar.loadWebinarThumbnail(kWebinar)

      // get sections
      this.connApi.get('webinar/sections-content/' + kWebinar, (aContent) => {
        this.aContent = aContent
      })
    })


    // initiate player
    this.setPlayer()

    // checker for process
    this.startProcessUpdater()


    // callback for change of visibility, e.g. on tab change
    // for coming back from other tab and primary putting cover on top before that
    // also needed for reloading page and before that putting scroll to top
    document.addEventListener("visibilitychange", (event) => {
      switch (document.visibilityState) {
        case "visible":
          break;
        case "hidden":
          // update unit-player
          this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo = this.player.currentTime()
          this.svWebinar.bsUnit.value!.oUnitPlayer!.tStatus = 1
          this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value!.oUnitPlayer)


          this.player.pause()
          // put cover on top
          this.vCover.nativeElement.style.zIndex = 7
          // scroll to top
          this.resetScroll()

          // close list
          this.onCloseList()

          this.bVisibilityChange = true
          break;
      }
    });
  }


  ngAfterViewInit(): void {
    // subscription to unit change
    this.svWebinar.bsUnit.subscribe(aUnit => {
      if (this.vCover !== undefined && this.vCover.nativeElement.style.zIndex == 0) {
        // only play when cover is not shown
        this.playUnit(aUnit)
        this.player.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)

        // update webinar-player set current-unit
        this.svWebinar.updateWebinarPlayer()
      } else {
        this.playUnit(aUnit, false)
        this.player.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)
      }

    })

    // input note


    window?.visualViewport?.addEventListener('resize', () => {
      let position = window!.visualViewport!.height - this.vInputNoteContainer.nativeElement.offsetHeight
      //this.renderer.setStyle(this.vInputNoteContainer.nativeElement, 'top', position + 'px')
      this.svAnimation.moveVertical(this.vInputNoteContainer, position, 0.26, null, 'ease-out')
      setTimeout(() => {
      }, 5)
    })

    // play icon
    console.log("joooo")
    this.renderer.setStyle(this.vPlay.nativeElement, 'opacity', 1)


    // initial size calls
    this.setHeight()
    this.wWindow = window.innerWidth;

    // this.vCover.nativeElement.style.top = "0px"

    // for testing of list
    //this.onOpenList()
    setTimeout(() => {

    }, this.TIME_INFORMATION_START * 1000)


  }


  ngOnDestroy(): void {

    this.player.dispose();
    this.stopProcessUpdater()

    // close slider
    this.svAnimation.slideOut(this.vList)
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // updating sizes upon change of screen size e.g. when nav bar collapses on ios
    this.wWindow = window.innerWidth;
    this.setHeight()
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    // count scrolling when enabled
    if (!this.bScrollDisabled) this.nScroll++

    if (this.nScroll === this.THRESHOLD_COVER_SCROLL) {
      // scrolling at the beginning when window is covered for triggered user engagement
      // in order for shrinking nav bar in ios mobile devices

      // info: There was a bug on ios which blocked the click on the video screen so that video couldn't be started or stopped
      // It was either solved by setting nScroll === Threshold or by timeout for scroll to bottom or by the order
      // where zIndex is set in the end. In the result user can swipe now and immediately click to play without waiting till scroll bar finished
      // giving only then the click for play free

      setTimeout(() => {

        window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"});
        setTimeout(() => {
          //window.scroll({top: 0, left: 0, behavior: "auto"});
        }, 30)


      }, 10);

      // hide cover
      this.vCover.nativeElement.style.zIndex = 0

      // hereby the video starts playing on scroll when it has been started already
      // Note: player can only be started manually when user interacted with the document
      // for some reason scroll event is triggered when changing tab, therefore a check
      // for visibility is necessary

      //if (this.player.paused()) this.player.play()


      if (this.bDocumentInteraction && this.documentVisible()) this.player.play()
    }
  }


  onSwipeMove($event) {
    // change vertical position of videoWrapper according to user swipe movement
    this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', $event.deltaY + 'px')
  }


  onSwipeEnd(ev) {
    // hide black line since the IOS pixel line bug is only shown before first scroll
    if (this.bShowBlackLineTop) this.bShowBlackLineTop = false

    if (Math.abs(ev.deltaY) < this.hVideoWrapper / 2 && Math.abs(ev.velocityY) < this.THRESHOLD_VIDEO_VELOCITY) {
      // threshold not reached and therefore bouncing video back - no video change

      // transition is set and after swipe taken away for instant movement in onSwipeMove()
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')
      setTimeout(() => {
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')
        },
        this.TRANSITION_VIDEO_SWIPE * 1000);

    } else {
      // threshold reached and therefore bouncing showing either last or next video

      if (ev.deltaY < 0) {
        // swipe up --> next video

        // transition is set and after swipe taken away for instant movement in onSwipeMove()
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', -this.hVideoWrapper + 'px')

        // set video poster with enough time to load before end of swipe
        this.player.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.getNextUnit()?.id)
        this.hideSidebar()
        this.bStopProcessUpdater = true
        setTimeout(() => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

            // after swipe showing video player in the middle again
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

            // play next unit
            this.svWebinar.setNextUnit(this.player.currentTime())

          },
          this.TRANSITION_VIDEO_SWIPE * 1000);
      }

      if (ev.deltaY > 0) {
        // swipe down --> last video

        // transition is set and after swipe taken away for instant movement in onSwipeMove()
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', this.hVideoWrapper + 'px')

        // set video poster with enough time to load before end of swipe
        this.player.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.lastUnit()?.id)
        this.hideSidebar()
        this.bStopProcessUpdater = true
        setTimeout(() => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

            // after swipe showing video player in the middle again
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

            // play last unit
            this.svWebinar.setUnit(this.svWebinar.lastUnit(), this.player.currentTime())
          },
          this.TRANSITION_VIDEO_SWIPE * 1000);
      }
    }
  }


  onProcessMove(ev) {
    console.log("onProcessMove()")
    // only called on real movement with delta values bigger than zero

    // making sure that due a delay the process bar is not set back to current video time while this code has run
    this.bStopProcessUpdater = true;

    // stop process so that the following code does not get overwritten
    this.stopProcessUpdater()

    // set process bar according to process move
    this.renderer.setStyle(this.vProcess.nativeElement, 'width', (ev.center.x / this.wWindow) * 100 + '%')

    // pause player in the first place of the move
    if (!this.player.paused()) this.player.pause()
  }


  onProcessEnd(ev) {
    console.log("onProcessEnd()")
    // only called after real movement with delta values bigger than zero

    // update current video time according to process end move
    this.player.currentTime(this.player.duration() * (ev.center.x / this.wWindow))

    // start process updater again and overtake current video time for updating the process bar
    this.startProcessUpdater()

    // start video again
    this.player.play()
  }


  onListInsideTap($event) {
    // tap enables click on item, normal build in click would be to sensitive since too much movement is allowed
    this.bClickListInsideDisabled = false
  }


  onListInsidePress(event) {
    // needed when list fades already in one direction but needs to be interrupted due to new touch and possibly different scroll direction
    console.log("onListInsidePress")
    this.bScrollListInsideEnabled = false
    if (event.deltaY == 0 && event.deltaX == 0) {
      console.log("joooo")
      // disable scrolling so that there is no bouncing which otherwise is applied after a timeout of fading
      this.bScrollListInsideEnabled = false
      this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')
      this.renderer.setStyle(this.vListInside.nativeElement, 'top', this.vListInside.nativeElement.offsetTop - this.vListHeader.nativeElement.offsetHeight + 'px')
    }
  }


  onListInsideStart(event: any) {
    // enable scrolling
    //this.bScrollListInsideEnabled = true
    console.log("ssstttarrrt")
    console.log(event);

    // reset transition so that action takes place immediately
    this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')

    // offsetTop of list
    this.offsetTopListStart = this.vList.nativeElement.offsetTop

    // offsetTop of list-inside (start would be the height of the list-header)
    this.offsetTopListInsideStart = this.vListInside.nativeElement.offsetTop

    // disables effect of click on item so that only tap can enable it which is not so sensitive
    this.bClickListInsideDisabled = true

    // saving the information whether user started to scroll up or down in the beginning
    this.tDirectionListStart = event.deltaY > 0 ? this.DIRECTION_LIST_START_UP : this.DIRECTION_LIST_START_DOWN
  }


  onListInsideMove(event: any) {

    const hListInside = this.vListInside.nativeElement.offsetHeight
    const hListHeader = this.vListHeader.nativeElement.offsetHeight

    // since offsetTopListInside is in the beginning the height of list-header this height needs to be subtracted because top-list
    // is in the beginning zero
    let topListInsideNew = this.offsetTopListInsideStart - hListHeader + event.deltaY

    // Depending on the start direction of the list movement threshold needs to added or removed during this whole period of scrolling
    if (this.tDirectionListStart === this.DIRECTION_LIST_START_DOWN) {
      topListInsideNew = topListInsideNew + environment.THRESHOLD_PAN
    }

    if (this.tDirectionListStart === this.DIRECTION_LIST_START_UP) {
      topListInsideNew = topListInsideNew - environment.THRESHOLD_PAN
    }


    // difference between height list-outside and height list-inside
    // negative: list-inside is bigger than list-outside
    // positive: list inside is smaller than list-outside
    const gapListInsideOutside = this.hListOutside - hListInside

    // console outputs
    console.log('deltay: ', event.deltaY)
    console.log('hListHeader: ' + hListHeader)
    console.log('topListStart: ' + this.offsetTopListInsideStart)
    console.log('hListOutside: ' + this.hListOutside)
    console.log('hListInside: ' + hListInside)
    console.log('topListInsideNew: ' + topListInsideNew)


    if (this.hListOutside >= hListInside) {
      // list-inside is smaller than list-outside and therefore no scrolling of list-inside

      if (topListInsideNew >= 0) {
        // animation closing of list
        console.log("animation list closinggg")

        this.renderer.setStyle(this.vList.nativeElement, 'top', this.offsetTopListStart + topListInsideNew + 'px')
      }
    } else {
      // scrolling of list-inside within its boundaries
      console.log("scrolling of list-inside within its boundaries")

      if (topListInsideNew >= gapListInsideOutside && topListInsideNew <= 0) {
        // actual scrolling
        console.log("actual scrolling")

        this.renderer.setStyle(this.vListInside.nativeElement, 'top', topListInsideNew + 'px')
      }

      if (topListInsideNew > 0) {
        // animation closing of list
        console.log("animation list closingg")

        this.renderer.setStyle(this.vList.nativeElement, 'top', this.offsetTopListStart + topListInsideNew + 'px')
      }

      if (topListInsideNew < gapListInsideOutside) {
        // animation overstretching with decreasing impact due to square algorithm
        console.log("animation overstretching with decreasing impact due to square algorithm")

        this.renderer.setStyle(this.vListInside.nativeElement, 'top', gapListInsideOutside - Math.pow(Math.abs(topListInsideNew - gapListInsideOutside), 0.75) + 'px')
      }
    }
  }


  onListInsideEnd(event: any) {
    console.log("ON LIST INSIDE END")
    console.log("------------------")
    // overstretching only possible when user released press/touch not while holding
    this.bScrollListInsideEnabled = true

    // values
    const velocityY = event.velocityY;
    const deltaY = event.deltaY;
    const offsetTopListInside = this.vListInside.nativeElement.offsetTop
    const hListHeader = this.vListHeader.nativeElement.offsetHeight
    const topListInside = offsetTopListInside - hListHeader
    const hListInside = this.vListInside.nativeElement.offsetHeight
    const hListOutside = this.vListOutside.nativeElement.offsetHeight
    const gapListInsideOutside = this.hListOutside - hListInside
    const offsetTopList = this.vList.nativeElement.offsetTop
    const movementList = offsetTopList - this.offsetTopListStart

    // console outputs
    console.log('VELOCITY: ' + event.velocityY)
    console.log('topListInsideOld: ' + topListInside)
    console.log('DELTA: ' + event.deltaY)

    if (hListInside > hListOutside && topListInside >= gapListInsideOutside && ((deltaY < 0 && velocityY < this.THRESHOLD_LIST_INSIDE_VELOCITY) || (deltaY > 0 && velocityY > this.THRESHOLD_LIST_INSIDE_VELOCITY) && topListInside < 0) && velocityY !== 0) {
      // fadeout scrolling
      console.log("fadeout scrolling")

      // further scrolling depending on velocity and variable overscroll list
      // can change if topListInsideEnd is out of boundary of list
      let overScroll = Math.abs(velocityY) * environment.OVERSCROLL_LIST

      if (deltaY < 0) {
        // fadeout scrolling down

        // taking topListInside into account instead of false offsetTopListInside
        let topListInsideEnd = topListInside + deltaY - overScroll

        if (topListInsideEnd < gapListInsideOutside) {
          // topListInsideEnd is out of boundary and therefore cut
          topListInsideEnd = gapListInsideOutside - Math.pow(Math.abs(topListInsideEnd - gapListInsideOutside), 0.625)
          overScroll = topListInsideEnd - topListInside - deltaY
        }

        // seconds for scrolling are calculated based on velocity (px/ms) and overscroll
        const secScroll = Math.abs(overScroll / velocityY) / 1000
        console.log("secScroll: ", secScroll)

        // ease out for smooth transition
        this.renderer.setStyle(this.vListInside.nativeElement, 'transition', secScroll + 's ease-out')
        this.renderer.setStyle(this.vListInside.nativeElement, 'top', topListInsideEnd + 'px')

        // code is executed after fadeout
        setTimeout(() => {
            this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')

            if (topListInsideEnd < gapListInsideOutside && this.bScrollListInsideEnabled) {
              // bScrollListInsideEnabled checks if scroll was interrupted by another press/touch on the list
              // topListInsideEnd overstretched the boundary therefore bouncing back
              console.log("topListInsideEnd overstretched the boundary therefore bouncing back")

              this.renderer.setStyle(this.vListInside.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
              this.renderer.setStyle(this.vListInside.nativeElement, 'top', gapListInsideOutside + 'px')
              setTimeout(() => {
                  this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')
                },
                this.TRANSITION_LIST_SWIPE * 1000);
            }
          },

          secScroll * 1000);
      }

      if (deltaY > 0) {
        // fadeout scrolling up
        console.log("fadeout scrolling up")

        // taking topListInside into account instead of false offsetTopListInside
        let topListInsideEnd = topListInside + deltaY + overScroll

        if (topListInsideEnd > 0) {
          // topListInsideEnd is out of boundary and therefore cut
          topListInsideEnd = Math.pow(Math.abs(topListInsideEnd), 0.625)
          if (movementList > 0) topListInsideEnd = 0
          overScroll = topListInsideEnd - topListInside
        }

        // seconds for scrolling are calculated based on velocity (px/ms) and overscroll
        const secScroll = Math.abs(overScroll / velocityY) / 1000
        console.log("secScroll: ", secScroll)

        // ease out for smooth transition
        this.renderer.setStyle(this.vListInside.nativeElement, 'transition', secScroll + 's ease-out')
        this.renderer.setStyle(this.vListInside.nativeElement, 'top', topListInsideEnd + 'px')


        // code is executed after fadeout
        setTimeout(() => {
            this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')

            if (movementList <= 0 && topListInsideEnd > 0 && this.bScrollListInsideEnabled) {
              // bScrollListInsideEnabled checks if scroll was interrupted by another press/touch on the list
              // topListInsideEnd overstretched the boundary therefore bouncing back
              console.log("topListInsideEnd overstretched the boundary therefore bouncing back")

              this.renderer.setStyle(this.vListInside.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
              this.renderer.setStyle(this.vListInside.nativeElement, 'top', 0 + 'px')
              setTimeout(() => {
                  this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')
                },
                this.TRANSITION_LIST_SWIPE * 1000);
            }

          },
          secScroll * 1000);
      }
    }


    // list movement > 0

    const middleList = this.heightList / 2


    if (movementList >= middleList || (movementList > 0 && (event.velocityY >= this.THRESHOLD_LIST_VELOCITY && event.deltaY > 0))) {
      // list is moved more than half or less but fast enough
      // closing list
      console.log("closing list")

      const offsetTopList = this.vList.nativeElement.offsetTop
      const restList = this.hWindow - offsetTopList

      // close list
      console.log("close list")
      console.log(event.velocityY)
      console.log(restList)
      const secTransitionListClose = restList / event.velocityY / 1000
      console.log("secClose: ", secTransitionListClose)


      this.renderer.setStyle(this.vList.nativeElement, 'transition', secTransitionListClose + 's')
      this.renderer.setStyle(this.vList.nativeElement, 'top', this.hWindow + 'px')
      this.bListOpen = false
      setTimeout(() => {
          this.renderer.setStyle(this.vList.nativeElement, 'transition', '0s')

        },
        secTransitionListClose * 1000);
    }

    if (movementList < middleList && (movementList > 0 && event.velocityY < this.THRESHOLD_LIST_VELOCITY && event.deltaY > 0)) {
      // movement less than half and velocity too low for closing therefore bounce back
      console.log("movement less than half and velocity too low for closing therefore bounce back")

      this.renderer.setStyle(this.vList.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
      this.renderer.setStyle(this.vList.nativeElement, 'top', this.offsetTopListStart + 'px')
      setTimeout(() => {
          this.renderer.setStyle(this.vList.nativeElement, 'transition', '0s')
        },
        this.TRANSITION_LIST_SWIPE * 1000);
    }


    // list inside
    if (gapListInsideOutside > 0) {
      this.renderer.setStyle(this.vListInside.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
      this.renderer.setStyle(this.vListInside.nativeElement, 'top', 0 + 'px')
      setTimeout(() => {
          this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')
        },
        this.TRANSITION_LIST_SWIPE * 1000);
    } else {
      if (topListInside < gapListInsideOutside) {
        // bounce back list-inside on bottom when user overstretched the list already while holding it
        console.log("bounce back list-inside on bottom when user overstretched the list already while holding it")

        this.renderer.setStyle(this.vListInside.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
        this.renderer.setStyle(this.vListInside.nativeElement, 'top', hListOutside - hListInside + 'px')
        setTimeout(() => {
            this.renderer.setStyle(this.vListInside.nativeElement, 'transition', '0s')
          },
          this.TRANSITION_LIST_SWIPE * 1000);
      }
    }

  }


  onListHeaderStart(event: any) {
    this.offsetTopListStart = this.vList.nativeElement.offsetTop
  }


  onListHeaderMove(event: any) {
    console.log(event)


    if (event.deltaY >= 0) {
      // header closing
      console.log("header closing")

      let topListInsideNew = this.offsetTopListStart + event.deltaY

      /*
      // Depending on the start direction of the list movement threshold needs to added or removed during this whole period of scrolling
      if (this.tDirectionListStart === this.DIRECTION_LIST_START_DOWN) {
        topListInsideNew = topListInsideNew + environment.THRESHOLD_PAN
      }

      if (this.tDirectionListStart === this.DIRECTION_LIST_START_UP) {
        topListInsideNew = topListInsideNew - environment.THRESHOLD_PAN
      }

       */

      topListInsideNew = topListInsideNew - environment.THRESHOLD_PAN

      this.renderer.setStyle(this.vList.nativeElement, 'top', topListInsideNew + 'px')
    }
  }


  onListHeaderEnd(event: any) {
    const offsetTopList = this.vList.nativeElement.offsetTop
    const middleList = this.heightList / 2
    const movementList = offsetTopList - this.offsetTopListStart
    const restList = this.hWindow - offsetTopList

    if (movementList >= middleList || (event.velocityY >= this.THRESHOLD_LIST_HEADER_VELOCITY && event.deltaY > 0)) {
      // close list
      console.log("close list")
      console.log(event.velocityY)
      console.log(restList)
      const secTransitionListClose = restList / event.velocityY / 1000
      console.log("secClose: ", secTransitionListClose)

      this.renderer.setStyle(this.vList.nativeElement, 'transition', secTransitionListClose + 's')
      this.renderer.setStyle(this.vList.nativeElement, 'top', this.hWindow + 'px')
      setTimeout(() => {
          this.renderer.setStyle(this.vList.nativeElement, 'transition', '0s')
          this.onCloseList(false)

        },
        secTransitionListClose * 1000);


    } else {
      // bounce back
      console.log("bounce back")

      this.renderer.setStyle(this.vList.nativeElement, 'transition', this.TRANSITION_LIST_SWIPE + 's')
      this.renderer.setStyle(this.vList.nativeElement, 'top', this.offsetTopListStart + 'px')
      setTimeout(() => {
          this.renderer.setStyle(this.vList.nativeElement, 'transition', '0s')
        },
        this.TRANSITION_LIST_SWIPE * 1000);
    }
  }


  onOpenList() {
    if (!this.bListOpen) {

      // set position depending on current unit
      const position = this.aHeights.pxHeightSection * (this.svWebinar.bsSection.value!.nPosition + 1) + this.aHeights.pxHeightUnit * (this.svWebinar.bsUnit.value!.nPosition > 0 ? (this.svWebinar.bsUnit.value!.nPosition - 1) : this.svWebinar.bsUnit.value!.nPosition)

      const gap = this.vListOutside.nativeElement.offsetHeight - this.vListInside.nativeElement.offsetHeight
      if (gap > 0) {
        this.renderer.setStyle(this.vListInside.nativeElement, 'top', 0 + 'px')
      } else {
        if (-position < gap) {
          // list shall not be overstretched, position is therefore set to end
          this.renderer.setStyle(this.vListInside.nativeElement, 'top', gap + 'px')
        } else {
          this.renderer.setStyle(this.vListInside.nativeElement, 'top', -position + 'px')
        }
      }

      console.log("wow")
      this.bListOpen = true

      // pause video
      this.pauseVideo()

      // animation
      this.svAnimation.slideIn(this.vList)
    }
  }


  onCloseList(bAnimation = true) {
    if (this.bListOpen) {

      // close all sections besides the one with the selected unit
      this.svWebinar.bsSections.value?.forEach(section => {
        section.bExpand = section.id === this.svWebinar.bsUnit.value?.kSection
      })

      this.bListOpen = false

      // play video
      this.playVideo()

      // animation
      if (bAnimation) this.svAnimation.slideOut(this.vList)

      // list closed and video played
      return true
    }
    // nothing happened cause list was already closed
    return false

  }


  onTabHome() {
    this.router.navigate(['start'])
    //this.svMenu.bsIndexMainMenu.next(0)
  }


  onClickShare() {
    if (navigator.share !== undefined) {

      let shareData = {
        title: "Webcoach",
        text: this.svWebinar.bsWebinar.value?.cName,
        url: "https://www.webcoach.digital/webinar-intro/" + this.svWebinar.bsWebinar.value?.id,
      };

      navigator
        .share(
          shareData
        )
        .then(() => console.log("Shared!"))
        .catch(err => console.error(err));
    } else {
      console.log("Error while sharing")
    }
  }

  onClickCheck() {
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.bsUnit.value!.oUnitPlayer!.tStatus = this.svWebinar.bsUnit.value?.oUnitPlayer?.tStatus == 2 ? 1 : 2
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value!.oUnitPlayer!)
  }


  startProcessUpdater() {
    // set to true when process bar moved
    this.bStopProcessUpdater = false

    // unsubscribe to make sure it doesn't get started multiple
    this.stopProcessUpdater()

    // subscribe
    this.process = interval(this.INTERVAL_PROCESS_UPDATER).subscribe(val => {
      if (!this.bStopProcessUpdater) {
        this.vProcess.nativeElement.style.width = (this.player.currentTime() / this.player.duration()) * 100 + '%'

        // views
        // sidebar
        if (this.svWebinar.bsUnit.value?.oUnitPlayer?.tStatus! < 2) {
          const secOverEnd = this.player.duration() - this.player.currentTime()
          if (secOverEnd <= this.TIME_SIDEBAR_END) {
            if (!this.bSidebarShown) {
              this.bSidebarHidden = false
              this.bSidebarShown = true
              console.log("secOverEnd", secOverEnd)
              console.log("SHHHOW")
              this.svAnimation.show([this.vSidebar])
            }
          } else {
            if (!this.bSidebarHidden) {
              this.bSidebarHidden = true
              this.bSidebarShown = false
              this.svAnimation.hide([this.vSidebar])
            }
          }
        } else {
          if (!this.bSidebarShown) {
            this.bSidebarHidden = false
            this.bSidebarShown = true
            console.log("SHHHOWWWWWWWWWW")
            this.svAnimation.show([this.vSidebar])
          }
        }

        // information
        const secOverStart = this.TIME_INFORMATION_START - this.player.currentTime()
        if (secOverStart > 0) {
          if (!this.bInformationShown) {
            this.bInformationHidden = false
            this.bInformationShown = true
            this.svAnimation.show([this.vInformation, this.vTitle])
          }
        } else {
          let secTimeout = 0
          if (this.bVisibilityChange) {
            secTimeout = this.TIME_INFORMATION_START
            this.bVisibilityChange = false
          }
          if (!this.bInformationHidden) {
            this.bInformationHidden = true
            this.bInformationShown = false
            this.svAnimation.hide([this.vInformation, this.vTitle], secTimeout)
          }
        }
      }
    });
  }


  stopProcessUpdater() {
    if (this.process !== undefined) this.process.unsubscribe()
  }


  onEventUnit(event: any) {
    switch (event.cEvent) {

      // unit selected
      case 'select':
        if (!this.bClickListInsideDisabled) {
          // upload status and time of current unit
          let aUnitOld: Unit = event.unitOld
          if (aUnitOld !== null) {
            aUnitOld.oUnitPlayer!.tStatus = 1
            aUnitOld.oUnitPlayer!.secVideo = this.getTime()
            this.svWebinar.uploadUnitPlayer(aUnitOld.oUnitPlayer)
          }

          // hide sidebar
          this.hideSidebar()

          // stop process-updater
          this.bStopProcessUpdater = true

          // set selected unit
          this.svWebinar.setUnit(event.unit)

          // close list
          this.onCloseList()
        }
        break

      // unit checked
      case 'check':
        // upload status and time of checked unit
        let unit: Unit = event.unit
        unit.oUnitPlayer!.tStatus = unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0
        unit.oUnitPlayer!.secVideo = 0

        this.svWebinar.uploadUnitPlayer(unit.oUnitPlayer)

        break
      case 'collapse':
        console.log("collapse")

        // timeout needed so that collapse can take effect in first place
        setTimeout(() => {
            const topListInside = this.vListInside.nativeElement.offsetTop // is not 0 when on top, has listheader added
            const heightListInside = this.vListInside.nativeElement.offsetHeight
            const heightListOutside = this.vListOutside.nativeElement.offsetHeight
            const hListHeader = this.vListHeader.nativeElement.offsetHeight
            const difference = heightListOutside - heightListInside + hListHeader


            console.log("topListInside: ", topListInside)
            console.log("heightListInside: ", heightListInside)
            console.log("heightListOutside: ", heightListOutside)
            console.log("difference: ", difference)
            console.log("hListHeader: ", hListHeader)

            // total crazy, setting listInsideTop to 0 is just right getting its offsetTop however is height ListHeader when it is complete at top
            // offset top is the distance the child element has to parent start, top is connected to the start of the view itself, 0 is start then
            // TODO note this important issue --> difference offsetTop and Top
            if (difference < 0 && difference > topListInside) {
              this.renderer.setStyle(this.vListInside.nativeElement, 'top', heightListOutside - heightListInside + 'px')
            }

            if (difference > 0) {
              this.renderer.setStyle(this.vListInside.nativeElement, 'top', 0 + 'px')
            }
          },
          200);
        break
    }
  }

  setPlayer() {
    let options = {
      fluid: false,
      fill: true,
      autoplay: false,
      controls: false,
    }

    this.player = videojs.default(this.video?.nativeElement, options, function () {
    })


    // TODO add environment variable for dev and prod mode
    this.player.volume(environment2.VOLUME_VIDEO)

    // ended callback
    this.player.on('ended', data => {
      this.bStopProcessUpdater = true

      this.svWebinar.setNextUnit()
    });

    // play callback
    this.player.on('play', data => {
      // set so that the video starts when coming back after swipe gesture on cover
      if (!this.bDocumentInteraction) {
        this.renderer.setStyle(this.vPlay.nativeElement, 'opacity', 0)
        this.bDocumentInteraction = true
      }

      // start process update for updating process bar
      this.startProcessUpdater()
    });

    // pause callback
    this.player.on('pause', data => {
      this.stopProcessUpdater()
      console.log('pauuse')
      // views
      this.svAnimation.show([this.vInformation, this.vTitle])
      this.svAnimation.show([this.vSidebar])
      this.bSidebarShown = true
      this.bSidebarHidden = false
      this.bInformationShown = true
      this.bInformationHidden = false
    });
  }


  playUnit(unit: Unit | null, play: boolean = true) {
    this.updatePlayer(this.connApi.getUrl('webinar/unit/video/' + unit?.id), play)
  }


  playVideo() {
    if (this.player.paused()) this.player.play()
  }


  pauseVideo() {
    if (!this.player.paused()) this.player.pause()
  }


  updatePlayer(source: string, play: boolean = true) {
    if (this.player !== undefined) {
      this.player.src({src: source, type: 'video/mp4'});
      if (play) this.player.play();
    }
  }


  getTime() {
    if (this.player !== null) {
      return this.player.currentTime()
    } else {
      return 0
    }
  }


  // sets height of video-container so that top and bottom
  // container can take this is as reference for the swipe gesture.
  // Needs to be called on afterViewInit and after each resize of the window
  setHeight() {
    this.hVideoWrapper = this.videoWrapper.nativeElement.offsetHeight
    this.heightList = this.vList.nativeElement.offsetHeight
    this.hWindow = window.innerHeight
    this.wWindow = window.innerWidth;

    // height of list-outside (container of the list-inside with constant height)
    this.hListOutside = this.vListOutside.nativeElement.offsetHeight
  }


  onClickVideo() {
    console.log("onClickVideo()")

    if (!this.onCloseList()) {
      // list wasn't closed

      if (this.player.paused()) {
        // animation of play icon
        if (this.bDocumentInteraction) {
          this.svAnimation.popup(this.vPlay)
        }

        // play
        this.player.play()


      } else {
        // pause
        this.player.pause()

        // animation of pause icon
        this.svAnimation.popup(this.vPause)
      }
    }
  }


  documentVisible(): boolean {
    // return true if document/window is visible
    return document.visibilityState === "visible"
  }


  resetScroll() {
    // disable tracking with scrolling counter
    this.bScrollDisabled = true;

    // rest scroll counter
    this.nScroll = 0

    // scroll to top
    window.scrollTo(0, 0)

    // enable tracking scrolling counter
    this.bScrollDisabled = false;
  }

  hideSidebar() {
    console.log('HHIIIDE')
    this.renderer.setStyle((this.vSidebar.nativeElement), 'transition', '0s')
    this.renderer.setStyle(this.vSidebar.nativeElement, 'opacity', 0)
    this.renderer.setStyle((this.vSidebar.nativeElement), 'transition', 'all 200ms ease-in-out')
    this.bSidebarShown = false
    this.bSidebarHidden = true
  }


  onNote() {
    console.log("onNote")

  }

  onNoteSettings(aNote: Note) {
    this.svWebinar.bsNote.next(aNote)
    this.cpListActionNotes.onOpenList()
    //this.onEditNote()
  }

  onEditNote($event) {
    console.log("onEditNote");

    // edit note
    this.svWebinar.bsNote.value.cNote = $event

    const data = {
      kNote: this.svWebinar.bsNote.value.id,
      cNote: $event,
    }
    this.connApi.safePost('note', data, (aNote: Note) => {
      console.log(aNote)
      this.svWebinar.bsNote.next(null)
      console.log('note edited: toast')
    })

    /*
    // show input and keyboard
    this.renderer.setStyle(this.vInputNoteContainer.nativeElement, "display", 'flex')
    this.vInputNote.nativeElement.focus()

     */

    //let heightCover = this.vCover.nativeElement.offsetHeight
    //let scrollPosition = document.documentElement.scrollTop
    //let positionNote = this.vInputNoteContainer.nativeElement.offsetTop

    //this.vInputNote.nativeElement.placeholder = "Cov: " + heightCover + "_Sp: " + scrollPosition + "_Note Pos: " + positionNote
    //let position = this.vInputNoteContainer.nativeElement.offsetHeight
    //window.scroll({top: 0, left: 0, behavior: "auto"});
    //window.scrollTo(0,0)

  }

  onDeleteNote() {
    console.log("onDeleteNote")
    this.connApi.safeDelete('note/' + this.svWebinar.bsNote.value.id, () => {
      this.cpListActionNotes.onCloseList()
      this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.forEach( (item, index) => {
        if(item === this.svWebinar.bsNote.value) this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.splice(index,1);
      });
      this.svWebinar.bsNote.next(null)
      console.log('note deleted')

    })

  }

  onNoteAdd($event) {
    // actual adding
    console.log($event)
    console.log("note addd")
    // add note

    const data = {
      kWebinar: this.svWebinar.bsWebinar.value?.id,
      kUnitPlayer: this.svWebinar.bsUnit.value?.oUnitPlayer?.id,
      kUnit: this.svWebinar.bsUnit.value?.id,
      secTime: this.player.currentTime(),
      cNote: $event,
    }
    this.connApi.safePut('note', data, (aNote: Note) => {
      console.log(aNote)
      this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes?.push(aNote)
      this.svWebinar.sortNotes()
      console.log('note added: toast')
    })
  }

  onNoteSend() {
    // take focus away
    this.vInputNote.nativeElement.blur()
    this.renderer.setStyle(this.vInputNoteContainer.nativeElement, "display", 'none')


    if (this.svWebinar.bsNote.value === null) {

    } else {

    }
  }


  onAddNote() {
    console.log("onAddNote");
    // show input and keyboard
    this.svWebinar.bsNote.next(null)

    this.cpListInputAddNote.show()

    //this.renderer.setStyle(this.vInputNoteContainer.nativeElement, "display", 'flex')
    //this.vInputNote.nativeElement.focus()
  }

  onShowEditNote() {
    this.cpListActionNotes.onCloseList()
    this.cpListInputEditNote.show(this.svWebinar.bsNote.value.cNote)
  }

  protected readonly console = console;

  outputListOpened() {
    this.pauseVideo()
  }

  outputListClosed() {
    this.playVideo()
  }

}
