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
import {Comment} from "../../../../interfaces/comment";
import {PlayerService} from "../../../../services/data/player.service";
import {CommentAnswer} from "../../../../interfaces/comment-answer";
import {Interval} from "../../../../interfaces/interval";
import {File} from "../../../../utils/file";
import {DomSanitizer} from "@angular/platform-browser";

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
  @ViewChild('vReplayStart') vReplayStart!: ElementRef
  @ViewChild('vPlayStart') vPlayStart!: ElementRef
  @ViewChild('vPause') vPause!: ElementRef
  @ViewChild('vTitle') vTitle!: ElementRef
  @ViewChild('vInformation') vInformation!: ElementRef
  @ViewChild('vSidebar') vSidebar!: ElementRef
  @ViewChild('vListInsideNotes') vListInsideNotes!: ElementRef
  @ViewChild('vListInsideComments') vListInsideComments!: ElementRef
  @ViewChild('vListInsideCommentAnswers') vListInsideCommentAnswers!: ElementRef
  @ViewChild('vListInsideDescription') vListInsideDescription!: ElementRef
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined
  @ViewChild('vInputNote') vInputNote!: ElementRef
  @ViewChild('vInputNoteContainer') vInputNoteContainer!: ElementRef
  @ViewChild('vProcessThumbnails') vProcessThumbnails!: ElementRef
  @ViewChild('vProcessThumbnail') vProcessThumbnail!: ElementRef
  @ViewChild('vProcessThumbnailImage') vProcessThumbnailImage!: ElementRef
  @ViewChild('vUnitLikeAnimation') vUnitLikeAnimation!: ElementRef
  @ViewChild('vUnitCommentAnimation') vUnitCommentAnimation!: ElementRef
  @ViewChild('vShareAnimation') vShareAnimation!: ElementRef
  @ViewChild('vCheckAnimation') vCheckAnimation!: ElementRef
  @ViewChild('vUnitLike', {read: ElementRef}) vUnitLike!: ElementRef
  @ViewChild('vVideoControls') vVideoControls!: ElementRef

  // integrated components
  @ViewChild('cpListActionNotes') cpListActionNotes!: ListActionComponent
  @ViewChild('cpListComments') cpListComments!: ListSliderComponent
  @ViewChild('cpListDescription') cpListDescription!: ListSliderComponent
  @ViewChild('cpListActionComments') cpListActionComments!: ListActionComponent
  @ViewChild('cpListActionCommentAnswers') cpListActionCommentAnswers!: ListActionComponent
  @ViewChild('cpListActionSettings') cpListActionSettings!: ListActionComponent
  @ViewChild('cpListActionVideoSpeed') cpListActionVideoSpeed!: ListActionComponent
  @ViewChild('cpListActionMaterial') cpListActionMaterial!: ListActionComponent
  @ViewChild('cpListInputAddNote') cpListInputAddNote!: ListInputComponent
  @ViewChild('cpListInputAddComment') cpListInputAddComment!: ListInputComponent
  @ViewChild('cpListInputAddCommentAnswer') cpListInputAddCommentAnswer!: ListInputComponent
  @ViewChild('cpListInputEditNote') cpListInputEditNote!: ListInputComponent
  @ViewChild('cpListInputEditComment') cpListInputEditComment!: ListInputComponent
  @ViewChild('cpListInputEditCommentAnswer') cpListInputEditCommentAnswer!: ListInputComponent

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
  readonly INTERVAL_SLOW_PROCESS_UPDATER = 1000 // ms
  readonly DIRECTION_LIST_START_UP = 1
  readonly DIRECTION_LIST_START_DOWN = 2
  readonly TIME_INFORMATION_START = 5 // sec
  readonly TIME_SIDEBAR_END = 10 // sec
  readonly SEC_VIDEO_INTERVAL = 30

  // tracker for list of units
  private bListOpen = false

  // gets changed in function setHeight()
  private hVideoWrapper = 0
  private wVideoWrapper = 0

  // needed for process
  public wWindow = 0

  // process-thumbnails
  public pProcess = 0
  public imgProcessThumbnail: any = null

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

  // filter
  readonly FILTER_ONE_COMMENT_TOP = 1
  readonly FILTER_ONE_COMMENT_NEW = 2
  public lFilterOne = [{id: this.FILTER_ONE_COMMENT_TOP, cName: 'Top-Kommentare'}, {id: this.FILTER_ONE_COMMENT_NEW, cName: 'Neueste zuerst'}]

  // movement
  private bMovementVertical = false
  private bMovementHorizontal = false

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
  processSlow!: Subscription

  public urlIntervalThumbnailLeft = ''
  public urlIntervalThumbnailRight = ''

  public lVideoSpeed = [{id: 0, speedFactor: 0.5, cName: '0.5x'}, {id: 1, speedFactor: 1, cName: '1x'}, {id: 2, speedFactor: 1.5, cName: '1.5x'}, {id: 3, speedFactor: 2, cName: '2x'}]
  public ksVideoSpeed = 1

  constructor(private sanitizer: DomSanitizer, private uFile: File, public svPlayer: PlayerService, public uDateTime: DateTime, private svMenu: MainMenuService, private svCoach: CoachService, private router: Router, private svAnimation: AnimationService, public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) {
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


          this.pauseVideo()
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

    this.svPlayer.downloadUserData()

    // unit thumbnail-interval
    this.svWebinar.bsUnitInterval.subscribe((aInterval) => {
      console.log("new Interval", aInterval)
      // before
      const urlImageBefore = this.svWebinar.bsUnit.value?.lIntervals[aInterval?.index === 0 ? 0 : aInterval!.index - 1].urlImage
      if (urlImageBefore !== null) {
        console.log("image set before")
        console.log(urlImageBefore)
        this.urlIntervalThumbnailLeft = urlImageBefore!
        this.svWebinar.bsUnitThumbnailLeft.next(urlImageBefore)
      }

      // after
      let urlImageAfter: any = null
      if (aInterval?.index === this.svWebinar.bsUnit.value?.lIntervals.length! - 1) {
        urlImageAfter = this.svWebinar.bsUnitThumbnailNext.value
      } else {
        urlImageAfter = this.svWebinar.bsUnit.value?.lIntervals[aInterval!.index - 1].urlImage
      }
      if (urlImageAfter !== null) {
        console.log("image set after", urlImageAfter)
        this.urlIntervalThumbnailRight = urlImageAfter!
      }
    })

  }


  ngAfterViewInit(): void {
    // subscription to unit change
    this.svWebinar.bsUnit.subscribe(aUnit => {
      if (this.vCover !== undefined && this.vCover.nativeElement.style.zIndex == 0) {
        // only play when cover is not shown
        console.log("PLLLAY")

        this.playUnit(aUnit, false)
        this.player.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)

        this.setProcess(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'flex')

        // update webinar-player set current-unit
        this.svWebinar.updateWebinarPlayer()
      } else {
        this.playUnit(aUnit, false)
        this.player.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)

        this.setProcess(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'flex')
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
    //this.renderer.setStyle(this.vPlay.nativeElement, 'opacity', 1)


    // initial size calls
    this.setHeight()
    this.wWindow = window.innerWidth;

    // this.vCover.nativeElement.style.top = "0px"

    // for testing of list
    //this.onOpenList()
    //this.cpListComments.onOpenList()
    setTimeout(() => {

    }, this.TIME_INFORMATION_START * 1000)

    // needs to be checked on android devices / chrome
    this.vUnitLike.nativeElement.addEventListener('pointerdown', event => {
      window.navigator.vibrate(1000)
    });


    // webinar-player
    this.svWebinar.bsWebinarPlayer.subscribe(aWebinarPlayer => {
      this.ksVideoSpeed = aWebinarPlayer?.kVideoSpeed!
      console.log("video SPEEEEEEEEEED", this.ksVideoSpeed)
      this.setVideoSpeed()
    })

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

      if (this.bDocumentInteraction && this.documentVisible()) this.playVideo()
    }
  }

  onSwipeStart(event) {
    console.log("onSwipeStart()")
    this.bMovementHorizontal = false
    this.bMovementVertical = false
  }

  onSwipeMove(event) {
    if (!this.bMovementHorizontal && !this.bMovementVertical) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        this.bMovementVertical = true
        console.log("Vertical movement")
      } else {
        this.bMovementHorizontal = true
        console.log("Horizontal movement")
      }
    }

    // Vertical movement
    if (this.bMovementVertical) {
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', event.deltaY + 'px')
    }

    // Horizontal movement
    if (this.bMovementHorizontal) {
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', event.deltaX + 'px')
    }
  }


  onSwipeEnd(ev) {
    if (this.bMovementVertical) {
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

    // horizontal movement
    if (this.bMovementHorizontal) {
      if (Math.abs(ev.deltaX) < this.wVideoWrapper / 2 && Math.abs(ev.velocityX) < this.THRESHOLD_VIDEO_VELOCITY) {
        // threshold not reached and therefore bouncing video back - no video change
        this.svAnimation.moveHorizontal(this.videoWrapper, 0, this.TRANSITION_VIDEO_SWIPE)
      } else {
        // threshold reached and therefore bouncing showing either backward of forward winding
        if (ev.deltaX < 0) {
          // swipe right --> next winding
          // transition is set and after swipe taken away for instant movement in onSwipeMove()
          this.pauseVideo(false)
          const nextIntervalTime = this.getNextIntervalTime()
          console.log(nextIntervalTime)
          if (nextIntervalTime) {
            this.player.currentTime(nextIntervalTime)
          } else {
            this.svWebinar.setNextUnit(this.player.currentTime())
          }

          this.svAnimation.moveHorizontal(this.videoWrapper, -this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', 0 + 'px')
            this.playVideo()
          })
          // set video poster with enough time to load before end of swipe
          //this.player.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.getNextUnit()?.id)
          //this.hideSidebar()
          //this.bStopProcessUpdater = true
        }

        if (ev.deltaX > 0) {
          // last video
          this.pauseVideo(false)
          this.player.currentTime(this.getLastIntervalTime())
          this.svAnimation.moveHorizontal(this.videoWrapper, +this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', 0 + 'px')
            this.playVideo()
            console.log(this.getLastIntervalTime())



          })

          // set video poster with enough time to load before end of swipe
          //this.player.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.lastUnit()?.id)
          //this.hideSidebar()
          //this.bStopProcessUpdater = true

        }
      }
    }

  }

  onProcessStart(event) {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'flex')
  }

  onProcessMove(ev) {
    console.log("onProcessMove()")
    // only called on real movement with delta values bigger than zero

    // making sure that due a delay the process bar is not set back to current video time while this code has run
    this.bStopProcessUpdater = true;

    // stop process so that the following code does not get overwritten
    this.stopProcessUpdater()

    // set process bar according to process move
    const pProcess_ = (ev.center.x / this.wWindow) * 100
    this.renderer.setStyle(this.vProcess.nativeElement, 'width', pProcess_ + '%')

    // percent view
    this.pProcess = Math.round(pProcess_)

    // process thumbnail
    this.imgProcessThumbnail =  this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.svWebinar.bsUnit.value?.lProcessThumbnails[this.pProcess]);

    // position x-axis thumbnail
    const dimenProcessThumbnailImage = this.vProcessThumbnailImage.nativeElement.getBoundingClientRect()


    //
    console.log("1", dimenProcessThumbnailImage.width/2)
    console.log("2", this.wWindow - (dimenProcessThumbnailImage.width/2))
    let position = ((this.pProcess * this.wWindow) / 100) - (dimenProcessThumbnailImage.width /2)
    console.log("position", position)
    if (position <= 0) {
      position = 0
    }

    if (position >= (this.wWindow - (dimenProcessThumbnailImage.width))) {
      position = this.wWindow - dimenProcessThumbnailImage.width
    }
    console.log("ppposition", position)
    this.renderer.setStyle(this.vProcessThumbnail.nativeElement, 'left', (position + 'px'))


    // pause player in the first place of the move
    if (!this.player.paused()) this.pauseVideo(false)
  }


  onProcessEnd(ev) {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'none')
    console.log("onProcessEnd()")
    // only called after real movement with delta values bigger than zero

    // update current video time according to process end move
    this.player.currentTime(this.player.duration() * (ev.center.x / this.wWindow))

    // start process updater again and overtake current video time for updating the process bar
    this.startProcessUpdater()

    // start video again
    this.playVideo()
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
      this.svAnimation.iconClick(this.vShareAnimation)

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
    this.svAnimation.iconClick(this.vCheckAnimation)
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.bsUnit.value!.oUnitPlayer!.tStatus = this.svWebinar.bsUnit.value?.oUnitPlayer?.tStatus == 2 ? 1 : 2
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value!.oUnitPlayer!)
  }

  setProcess(secCurrent, secTotal) {
    this.vProcess.nativeElement.style.width = (secCurrent / secTotal) * 100 + '%'
  }

  startProcessUpdater() {
    // set to true when process bar moved
    this.bStopProcessUpdater = false

    // unsubscribe to make sure it doesn't get started multiple
    this.stopProcessUpdater()
    this.startSlowProcessUpdater()

    // subscribe
    this.process = interval(this.INTERVAL_PROCESS_UPDATER).subscribe(val => {
      if (!this.bStopProcessUpdater) {
        this.setProcess(this.player.currentTime(), this.player.duration())

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

  startSlowProcessUpdater() {
    this.processSlow = interval(this.INTERVAL_SLOW_PROCESS_UPDATER).subscribe(val => {
      console.log("slowProcessUpdater")
      if (!this.bStopProcessUpdater) {
        console.log("slowProcessUpdater")
        if (this.svWebinar.bsUnitInterval.value !== null) {
          if (this.player.currentTime() > this.svWebinar.bsUnitInterval.value?.secEnd || this.player.currentTime() < this.svWebinar.bsUnitInterval.value?.secStart) {
            this.setNewUnitInterval()
          }
        } else {
          this.setNewUnitInterval()
        }

        // update images
        this.updateIntervalThumbnails()
      }
    })
  }

  stopSlowProcessUpdater() {
    if (this.processSlow !== undefined) this.processSlow.unsubscribe()
  }

  setNewUnitInterval() {
    console.log("intervals", this.svWebinar.bsUnit.value?.lIntervals[Math.floor(this.player.currentTime() / this.SEC_VIDEO_INTERVAL)])
    if (this.svWebinar.bsUnitInterval.value === null || this.svWebinar.bsUnitInterval.value!.index !== this.svWebinar.bsUnit.value?.lIntervals[Math.floor(this.player.currentTime() / this.SEC_VIDEO_INTERVAL)]!.index) {
      this.svWebinar.bsUnitInterval.next(this.svWebinar.bsUnit.value?.lIntervals[Math.floor(this.player.currentTime() / this.SEC_VIDEO_INTERVAL)]!)
    }
  }

  updateIntervalThumbnails() {
    // left
    this.urlIntervalThumbnailLeft = this.svWebinar.bsUnit.value?.lIntervals[this.getLastInterval()].urlImage

    // right
    const nextInterval = this.getNextInterval()
    if (nextInterval) {
      this.urlIntervalThumbnailRight = this.svWebinar.bsUnit.value?.lIntervals[nextInterval].urlImage
    } else {
      this.urlIntervalThumbnailRight = this.svWebinar.bsUnitThumbnailNext.value
    }

  }


  stopProcessUpdater() {
    if (this.process !== undefined) this.process.unsubscribe()
    this.stopSlowProcessUpdater()
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
      console.log('not really')
      this.setVideoSpeed()
    });

    // pause callback
    this.player.on('pause', data => {
      console.log("what ")
    });
  }


  playUnit(unit: Unit | null, play: boolean = true) {
    this.updatePlayer(this.connApi.getUrl('webinar/unit/video/' + unit?.id), play)
  }


  playVideo() {
    this.setNewUnitInterval()
    if (this.player.paused() || true) {
      console.log("play real")
      // set so that the video starts when coming back after swipe gesture on cover
      if (!this.bDocumentInteraction) {
        this.renderer.setStyle(this.vPlay.nativeElement, 'opacity', 0)
        this.bDocumentInteraction = true
      }

      // start process update for updating process bar
      this.startProcessUpdater()

      console.log("PLAYING?")
      this.player.play()
    }
  }


  pauseVideo(bShowInformation = true) {
    if (!this.player.paused()) {
      this.player.pause()
      this.stopProcessUpdater()
      console.log('pauuse')
      // views
      if (bShowInformation) {
        this.svAnimation.show([this.vInformation, this.vTitle])
        this.svAnimation.show([this.vSidebar])
        this.bSidebarShown = true
        this.bSidebarHidden = false
        this.bInformationShown = true
        this.bInformationHidden = false
      }
    }
  }

  setVideoSpeed() {
    this.lVideoSpeed.forEach(aVideoSpeed => {
      if (aVideoSpeed.id === this.ksVideoSpeed) this.player.playbackRate(aVideoSpeed.speedFactor)
    })
  }


  updatePlayer(source: string, play: boolean = true) {
    if (this.player !== undefined) {
      this.player.src({src: source, type: 'video/mp4'});
      if (play) this.playVideo()
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
    this.wVideoWrapper = this.videoWrapper.nativeElement.offsetWidth
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
        this.playVideo()


      } else {
        // pause
        this.pauseVideo()

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
    this.cpListActionNotes.show()
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
      this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.forEach((item, index) => {
        if (item === this.svWebinar.bsNote.value) this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.splice(index, 1);
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


  onCommentAdd($event) {
    // actual adding
    console.log($event)
    console.log("comment addd")
    // add note

    const data = {
      kWebinar: this.svWebinar.bsWebinar.value?.id,
      kUnit: this.svWebinar.bsUnit.value?.id,
      cText: $event,
    }
    this.connApi.safePut('comment', data, (aComment: Comment) => {
      this.svWebinar.bsUnit.value!.nComments++
      console.log(aComment)
      this.svWebinar.bsUnit.value?.lComments?.push(aComment)
      this.svWebinar.sortComments()
      console.log(this.svWebinar.bsUnit.value!.lComments)
      console.log('comment added: toast')
    })
  }

  onEditComment($event) {
    console.log("onEditComment");

    // edit note
    this.svWebinar.bsComment.value!.cText = $event

    const data = {
      kComment: this.svWebinar.bsComment.value?.id,
      cText: $event,
    }
    this.connApi.safePost('comment', data, (aComment: Comment) => {
      console.log(aComment)
      this.svWebinar.bsComment.next(null)
      console.log('comment edited: toast')
    })

  }

  onAddComment() {
    this.svWebinar.bsComment.next(null)
    this.cpListInputAddComment.show()
  }

  onDeleteComment() {
    console.log("onDeleteComment")


    // remote
    this.connApi.safeDelete('comment/' + this.svWebinar.bsComment.value?.id, () => {
      this.svWebinar.bsUnit.value!.nComments--
      this.cpListActionComments.onCloseList()
      this.svWebinar.bsUnit.value?.lComments!.forEach((item, index) => {
        if (item === this.svWebinar.bsComment.value) this.svWebinar.bsUnit.value?.lComments!.splice(index, 1);
      });
      this.svWebinar.bsComment.next(null)
    })

  }


  onShowEditComment() {
    this.cpListActionComments.onCloseList()
    this.cpListInputEditComment.show(this.svWebinar.bsComment.value?.cText)
  }

  showListCommentAnswers(aComment: Comment) {
    if (!this.cpListComments.isScrolling()) {
      this.svWebinar.bsComment.next(aComment)
      if (aComment.nAnswers > 0) this.svWebinar.loadCommentAnswers(aComment)
      this.cpListComments.showListTwo()
    } else {
      this.cpListComments.stopScrolling(this.vListInsideComments)
    }
  }

  onClickComment_Answer(aComment: Comment) {
    if (this.scrollCheckListComments()) {
      this.showListCommentAnswers(aComment)
      this.showInputCommentAnswer(aComment)
    }

  }


  onClickComment_Like(aComment: Comment) {
    if (this.scrollCheckListComments()) {
      const data = {
        kComment: aComment.id,
        bLike: aComment.bLike ? 0 : 1
      }

      this.connApi.safePost('comment/like', data, () => {
        aComment.bLike = !aComment.bLike
        if (aComment.bLike) {
          aComment.nLikes++
        } else {
          aComment.nLikes--
        }
      })
    }
  }

  onClickComment_Settings(aComment: Comment) {
    console.log("onCommentSettings()")
    if (this.scrollCheckListComments()) {
      if (this.svPlayer.isUser(aComment.kPlayer)) {
        this.svWebinar.bsComment.next(aComment)
        this.cpListActionComments.show()
      } else {
        // TODO: report
      }
    }
  }


  scrollCheckListComments() {
    if (this.cpListComments.isScrolling()) {
      this.cpListComments.stopScrolling(this.vListInsideComments)
      return false
    }
    return true
  }

  scrollCheckListCommentAnswers() {
    if (this.cpListComments.isScrolling()) {
      this.cpListComments.stopScrolling(this.vListInsideCommentAnswers)
      return false
    }
    return true
  }


  onListOpened() {
    this.pauseVideo()
  }

  onListClosed() {
    this.playVideo()
  }

  onAddCommentAnswer(aCommentAnswerRegard: CommentAnswer | null = null) {
    if (this.scrollCheckListCommentAnswers()) {
      this.svWebinar.bsCommentAnswer.next(null)
      this.svWebinar.bsCommentAnswerRegard.next(aCommentAnswerRegard)
      this.cpListInputAddCommentAnswer.show('', aCommentAnswerRegard?.cPlayer)
    }
  }


  showInputCommentAnswer(aComment: Comment) {
    // show input and keyboard
    console.log("onShowAddCommentAnswer()")
    console.log(aComment)
    this.svWebinar.bsComment.next(aComment)
    this.svWebinar.bsCommentAnswer.next(null)
    this.cpListInputAddCommentAnswer.show('', null, 'Antwort hinzufügen...')
  }

  onShowEditCommentAnswer() {
    this.cpListActionCommentAnswers.onCloseList()
    this.cpListInputEditCommentAnswer.show(this.svWebinar.bsCommentAnswer.value?.cText, this.svWebinar.bsCommentAnswerRegard.value?.cPlayer)
  }

  onDeleteCommentAnswer() {
    console.log("onDeleteCommentAnswer")
    this.connApi.safeDelete('comment-answer/' + this.svWebinar.bsCommentAnswer.value?.id, () => {
      this.cpListActionCommentAnswers.onCloseList()
      this.svWebinar.bsComment.value?.lCommentAnswers!.forEach((item, index) => {
        if (item === this.svWebinar.bsCommentAnswer.value) {
          this.svWebinar.bsComment.value?.lCommentAnswers!.splice(index, 1);
          this.svWebinar.bsComment.value!.nAnswers--
        }
      });
      this.svWebinar.bsCommentAnswer.next(null)
    })
  }

  onCommentAnswerAdd($event: any) {
    // actual adding
    console.log($event)
    console.log("comment-answer addd")
    // add note
    let aCommentAnswerRegard: CommentAnswer | null = this.svWebinar.bsCommentAnswerRegard.value

    const data = {
      kComment: this.svWebinar.bsComment.value?.id,
      cText: $event,
      kPlayerRegard: aCommentAnswerRegard !== null ? aCommentAnswerRegard.kPlayer : null
    }
    this.connApi.safePut('comment-answer', data, (aCommentAnswer: CommentAnswer) => {
      console.log(aCommentAnswer)
      this.svWebinar.bsComment.value?.lCommentAnswers?.push(aCommentAnswer)
      this.svWebinar.bsComment.value!.nAnswers++
      console.log(this.svWebinar.bsComment.value?.lCommentAnswers)
      console.log('comment-answer added: toast')
    })
  }

  onEditCommentAnswer($event: any) {
    console.log("onEditCommentAnswer");

    // edit note
    this.svWebinar.bsCommentAnswer.value!.cText = $event

    const data = {
      kCommentAnswer: this.svWebinar.bsCommentAnswer.value?.id,
      cText: $event,
    }
    this.connApi.safePost('comment-answer', data, (response: any) => {
      this.svWebinar.bsCommentAnswer.next(null)
      console.log('comment-answer edited: toast')
    })
  }

  onClickCommentAnswer_Settings(aCommentAnswer: CommentAnswer) {
    if (this.scrollCheckListCommentAnswers()) {
      if (aCommentAnswer.kPlayer === this.svPlayer.bsUserData.value?.id) {
        this.svWebinar.bsCommentAnswer.next(aCommentAnswer)
        this.cpListActionCommentAnswers.show()
      } else {
        // TODO: report
      }
    }
  }

  onClickCommentAnswer_Like(aCommentAnswer: CommentAnswer) {
    if (this.scrollCheckListCommentAnswers()) {
      let data = {
        kCommentAnswer: aCommentAnswer.id,
        bLike: aCommentAnswer.bLike ? 0 : 1
      }
      console.log(data)
      this.connApi.safePost('comment-answer/like', data, () => {
        aCommentAnswer.bLike = !aCommentAnswer.bLike
        if (aCommentAnswer.bLike) {
          aCommentAnswer.nLikes++
        } else {
          aCommentAnswer.nLikes--
        }
      })
    }
  }


  setFilterComments(kSelectedFilter) {
    this.svPlayer.bsUserData.value!.kFilterComments = kSelectedFilter
    this.connApi.safePost('player/filter-comments', {kFilterComments: kSelectedFilter}, null)
    this.orderComments()
  }

  orderComments() {
    switch (this.svPlayer.bsUserData.value!.kFilterComments) {
      case this.FILTER_ONE_COMMENT_NEW:
        this.svWebinar.bsUnit.value?.lComments.sort((a, b) => new Date(b.dtCreation).getTime() - new Date(a.dtCreation).getTime())
        break
      case this.FILTER_ONE_COMMENT_TOP:
        this.svWebinar.bsUnit.value?.lComments.sort((a, b) => b.nAnswers - a.nAnswers)
        break
    }
  }

  onComments() {
    this.svAnimation.iconClick(this.vUnitCommentAnimation)
    this.cpListComments.onOpenList()
    this.orderComments()
  }

  onClickUnitLike() {
    // vibration

    this.svAnimation.iconClick(this.vUnitLikeAnimation)

    // change local
    this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike = !this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike
    this.svWebinar.bsUnit.value!.nLikes = this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike ? this.svWebinar.bsUnit.value!.nLikes + 1 : this.svWebinar.bsUnit.value!.nLikes - 1

    // change remote
    const data = {
      kUnitPlayer:  this.svWebinar.bsUnit.value!.oUnitPlayer!.id,
      bLike: this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike ? 1 : 0
    }
    this.connApi.safePost('webinar/auth/unit-player/like', data, null)
  }

  // winding functions
  getNextIntervalTime(): number | null {
    const nextInterval = this.getNextInterval()
    if (nextInterval) {
      return this.getStartTimeInterval(nextInterval)
    }
    return null
  }

  getLastIntervalTime(): number {
    return this.getStartTimeInterval(this.getLastInterval())
  }

  getStartTimeInterval = (interval) => interval * this.SEC_VIDEO_INTERVAL

  getNextInterval(): number | null {
    const currentTime = this.player.currentTime()
    const currentInterval = this.svWebinar.bsUnitInterval.value?.index!
    const nextInterval = (currentTime % this.SEC_VIDEO_INTERVAL) < 25 ? currentInterval + 1 : currentInterval + 2
    if (nextInterval <= this.svWebinar.bsUnit.value?.lIntervals.length!) {
      return nextInterval
    }
    return null
  }

  getLastInterval() {
    const currentTime = this.player.currentTime()
    const currentInterval = this.svWebinar.bsUnitInterval.value?.index!
    const nextInterval = (currentTime % this.SEC_VIDEO_INTERVAL) > 5 ? currentInterval - 1 : currentInterval - 2
    if (nextInterval >= 0) {
      return nextInterval
    }
    return 0
  }

  onClick_Settings() {
    this.cpListActionSettings.show()
  }

  onClick_VideoSpeed() {
    this.cpListActionSettings.onCloseList()
    this.cpListActionVideoSpeed.show()
  }

  onSelect_VideoSpeed(aVideoSpeed) {
    // local
    this.ksVideoSpeed = aVideoSpeed.id
    this.setVideoSpeed()

    // remote
    const data = {
      kWebinarPlayer: this.svWebinar.bsWebinarPlayer.value?.id,
      kVideoSpeed: aVideoSpeed.id
    }
    this.connApi.safePost('webinar-player/video-speed', data, null)

    this.cpListActionVideoSpeed.onCloseList()

  }

  onClick_Description() {
    this.cpListActionSettings.onCloseList()
    this.cpListDescription.onOpenList()
  }

  onClick_Material() {
    this.cpListActionSettings.onCloseList()
    this.cpListActionMaterial.show()
    console.log(this.svWebinar.bsUnit.value)
  }

  onSelect_Material(aMaterial) {
    this.connApi.safeGetFile('webinar/auth/unit/material/' + this.svWebinar.bsUnit.value?.id + '/' + aMaterial.cName, (blob: any) => {
      this.uFile.openBlob(blob)
    })
  }

  onClick_Replay() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'none');
    this.player.currentTime(0)
    this.playVideo()
  }

  onClick_Play() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'none');
    this.playVideo()
  }
}
