import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Unit} from "../../../../interfaces/unit";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Communication} from "../../../../services/communication/communication.service";
import * as videojs from "video.js";
import {interval, Subscription} from "rxjs";
import {WebinarService} from "../../../../services/data/webinar.service";
import {AnimationService} from "../../../../services/animation.service";
import {environment} from "../../../../../environments/environment";
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
import {File} from "../../../../utils/file";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.page.html',
  styleUrls: ['./webinar.page.scss'],
  providers: [MainMenuService, DateTime],
})

export class WebinarPage implements OnInit, AfterViewInit, OnDestroy {

  // views
  @ViewChild('vCheckAnimation') vCheckAnimation!: ElementRef
  @ViewChild('vCover') vCover!: ElementRef
  @ViewChild('vInformation') vInformation!: ElementRef
  @ViewChild('vInputNote') vInputNote!: ElementRef
  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vListHeader') vListHeader!: ElementRef
  @ViewChild('vListInside') vListInside!: ElementRef
  @ViewChild('vListInsideCommentAnswers') vListInsideCommentAnswers!: ElementRef
  @ViewChild('vListInsideComments') vListInsideComments!: ElementRef
  @ViewChild('vListInsideDescription') vListInsideDescription!: ElementRef
  @ViewChild('vListInsideNotes') vListInsideNotes!: ElementRef
  @ViewChild('vListOutside') vListOutside!: ElementRef
  @ViewChild('vPause') vPause!: ElementRef
  @ViewChild('vPlay') vPlay!: ElementRef
  @ViewChild('vPlayStart') vPlayStart!: ElementRef
  @ViewChild('vProgressBar') vProgressBar!: ElementRef
  @ViewChild('vProcessThumbnail') vProcessThumbnail!: ElementRef
  @ViewChild('vProgressThumbnail') vProgressThumbnail!: ElementRef
  @ViewChild('vProcessThumbnails') vProcessThumbnails!: ElementRef
  @ViewChild('vReplayStart') vReplayStart!: ElementRef
  @ViewChild('vShareAnimation') vShareAnimation!: ElementRef
  @ViewChild('vSidebar') vSidebar!: ElementRef
  @ViewChild('vSwipe') vSwipe!: ElementRef
  @ViewChild('vTabs') vTabs!: ElementRef
  @ViewChild('vTitle') vTitle!: ElementRef
  @ViewChild('vUnitCommentAnimation') vUnitCommentAnimation!: ElementRef
  @ViewChild('vUnitLike', {read: ElementRef}) vUnitLike!: ElementRef
  @ViewChild('vUnitLikeAnimation') vUnitLikeAnimation!: ElementRef
  @ViewChild('vVideoControls') vVideoControls!: ElementRef
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined
  @ViewChild('videoBottom') videoBottom!: ElementRef
  @ViewChild('videoTop') videoTop!: ElementRef
  @ViewChild('videoWrapper') videoWrapper!: ElementRef

  // components
  @ViewChild('cpListActionCommentAnswers') cpListActionCommentAnswers!: ListActionComponent
  @ViewChild('cpListActionComments') cpListActionComments!: ListActionComponent
  @ViewChild('cpListActionMaterial') cpListActionMaterial!: ListActionComponent
  @ViewChild('cpListActionNotes') cpListActionNotes!: ListActionComponent
  @ViewChild('cpListActionSettings') cpListActionSettings!: ListActionComponent
  @ViewChild('cpListActionVideoSpeed') cpListActionVideoSpeed!: ListActionComponent
  @ViewChild('cpListComments') cpListComments!: ListSliderComponent
  @ViewChild('cpListNotes') cpListNotes!: ListSliderComponent
  @ViewChild('cpListDescription') cpListDescription!: ListSliderComponent
  @ViewChild('cpListInputAddComment') cpListInputAddComment!: ListInputComponent
  @ViewChild('cpListInputAddCommentAnswer') cpListInputAddCommentAnswer!: ListInputComponent
  @ViewChild('cpListInputAddNote') cpListInputAddNote!: ListInputComponent
  @ViewChild('cpListInputEditComment') cpListInputEditComment!: ListInputComponent
  @ViewChild('cpListInputEditCommentAnswer') cpListInputEditCommentAnswer!: ListInputComponent
  @ViewChild('cpListInputEditNote') cpListInputEditNote!: ListInputComponent

  // constants
  readonly THRESHOLD_COVER_SCROLL = 3
  readonly THRESHOLD_VIDEO_VELOCITY = 0.25 // px/ms
  readonly THRESHOLD_LIST_VELOCITY = 1.5 // px/ms
  readonly THRESHOLD_LIST_HEADER_VELOCITY = 0.30 // px/ms
  readonly THRESHOLD_LIST_INSIDE_VELOCITY = 0.30 // px/ms
  readonly TRANSITION_VIDEO_SWIPE = 0.35 // s
  readonly TRANSITION_LIST_SWIPE = environment.TRANSITION_LIST_SWIPE // s
  readonly INTERVAL_PROGRESS_UPDATER = 100 // ms
  readonly INTERVAL_PROGRESS_OBSERVER = 1000 // ms
  readonly DIRECTION_LIST_START_UP = 1
  readonly DIRECTION_LIST_START_DOWN = 2
  readonly TIME_INFORMATION_START = 5 // sec
  readonly TIME_SIDEBAR_END = 10 // sec
  readonly SEC_VIDEO_INTERVAL = 30
  readonly FILTER_ONE_COMMENT_TOP = 1
  readonly FILTER_ONE_COMMENT_NEW = 2

  // public variables
  public aContent: any | null = null
  public aHeights = {pxHeightSection: 0, pxHeightUnit: 0}
  public bShowBlackLineTop = true
  public hWindow = 0
  public imgProgressThumbnail: any = null
  public ksVideoSpeed = 1
  public lFilterOne = [{id: this.FILTER_ONE_COMMENT_TOP, cName: 'Top-Kommentare'}, {id: this.FILTER_ONE_COMMENT_NEW, cName: 'Neueste zuerst'}]
  public lVideoSpeed = [{id: 0, speedFactor: 0.5, cName: '0.5x'}, {id: 1, speedFactor: 1, cName: '1x'}, {id: 2, speedFactor: 1.5, cName: '1.5x'}, {
    id: 3,
    speedFactor: 2,
    cName: '2x'
  }]
  public oPlayer!: videojs.default.Player;
  public pProgress = 0
  public urlIntervalThumbnailLeft = ''
  public urlIntervalThumbnailRight = ''
  public wWindow = 0

  // private variables
  private bClickListInsideDisabled = true
  private bDocumentInteraction = false
  private bInformationHidden = false
  private bInformationShown = false
  private bListOpen = false
  private bMovementHorizontal = false
  private bMovementVertical = false
  private bScrollDisabled = false
  private bScrollListInsideEnabled = false
  private bSidebarHidden = false
  private bSidebarShown = false
  private bProgressUpdaterRunning = true
  private bVisibilityChange = false
  private hListOutside = 0
  private hVideoWrapper = 0
  private heightList = 0
  private nScroll = 0
  private oProgressUpdater!: Subscription;
  private oProgressObserver!: Subscription
  private offsetTopListInsideStart = 0
  private offsetTopListStart = 0
  private tDirectionListStart = 0
  private wVideoWrapper = 0


  constructor(private sanitizer: DomSanitizer, private uFile: File, public svPlayer: PlayerService, public uDateTime: DateTime, private svMenu: MainMenuService, private svCoach: CoachService, private router: Router, private svAnimation: AnimationService, public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private api: ConnApiService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const kWebinar = params['kWebinar'];

      this.svWebinar.load(kWebinar);
      this.svWebinar.loadWebinarThumbnail(kWebinar)
      this.svPlayer.downloadUserData()

      this.api.get('webinar/sections-content/' + kWebinar, aContent => this.aContent = aContent)
    })

    this.svWebinar.bsUnit.subscribe(aUnit => {
      if (this.vCover !== undefined && this.vCover.nativeElement.style.zIndex == 0) {

        this.playUnit(aUnit, false)
        this.oPlayer.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)

        this.updateProgressBar(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'flex')

        this.svWebinar.updateWebinarPlayer()
      } else {
        this.playUnit(aUnit, false)
        this.oPlayer.currentTime(aUnit?.oUnitPlayer?.secVideo ?? 0)

        this.updateProgressBar(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'flex')
      }
    })

    this.svWebinar.bsWebinarPlayer.subscribe(aWebinarPlayer => {
      this.ksVideoSpeed = aWebinarPlayer?.kVideoSpeed!
      this.setVideoSpeed()
    })

    this.setupPlayer()
    this.startProgressUpdater()

    // callback for change of visibility, e.g. on tab change
    document.addEventListener("visibilitychange", () => {
      switch (document.visibilityState) {
        case "visible":
          break;

        case "hidden":
          this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo = this.oPlayer.currentTime()
          this.svWebinar.bsUnit.value!.oUnitPlayer!.tStatus = 1
          this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value!.oUnitPlayer)

          this.pauseVideo()
          this.vCover.nativeElement.style.zIndex = 7
          // scroll to top
          this.resetScroll()
          this.onCloseList()
          this.bVisibilityChange = true
          break;
      }
    });

    this.svWebinar.bsUnitInterval.subscribe((aInterval) => {
      const urlImageLeft = this.svWebinar.bsUnit.value?.lIntervals[aInterval?.index === 0 ? 0 : aInterval!.index - 1].urlImage
      if (urlImageLeft !== null) {
        this.urlIntervalThumbnailLeft = urlImageLeft!
      }

      let urlImageRight: any
      if (aInterval?.index === this.svWebinar.bsUnit.value?.lIntervals.length! - 1) {
        urlImageRight = this.svWebinar.bsUnitThumbnailNext.value
      } else {
        urlImageRight = this.svWebinar.bsUnit.value?.lIntervals[aInterval!.index - 1].urlImage
      }
      if (urlImageRight !== null) {
        this.urlIntervalThumbnailRight = urlImageRight!
      }
    })
  }


  ngAfterViewInit(): void {
    this.setDimensions()

    // works only on non safari browsers
    this.vUnitLike.nativeElement.addEventListener('pointerdown', event => {
      window.navigator.vibrate(1000)
    });
  }


  ngOnDestroy(): void {
    this.oPlayer.dispose();
    this.stopProgressUpdater()

    // close slider
    //this.svAnimation.slideOut(this.vList)
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    // updating sizes upon change of screen size e.g. when nav bar collapses in browsers like safari
    this.setDimensions()
  }


  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.bScrollDisabled) this.nScroll++

    if (this.nScroll === this.THRESHOLD_COVER_SCROLL) {
      // scrolling at the beginning when window is covered for triggered user engagement
      // in order for shrinking the browsers nav bar

      // info: There was a bug on ios which blocked the click on the video screen so that video couldn't be started or stopped
      // It was either solved by setting nScroll === Threshold or by timeout for scroll to bottom or by the order
      // where zIndex is set in the end. In the result user can swipe now and immediately click to play without waiting till scroll bar finished
      // giving only then the click for play free

      setTimeout(() => {
        window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"});
      }, 10);

      // hide cover
      this.vCover.nativeElement.style.zIndex = 0

      // hereby the video starts playing on scroll when it has been started already
      // Note: player can only be started manually when user interacted with the document
      // for some reason scroll event is triggered when changing tab, therefore a check
      // for visibility is necessary
      if (this.bDocumentInteraction && document.visibilityState === "visible") this.playVideo()
    }
  }


  onStart_Video() {
    this.bMovementHorizontal = false
    this.bMovementVertical = false
  }

  onMove_Video(event) {
    if (!this.bMovementHorizontal && !this.bMovementVertical) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        this.bMovementVertical = true
      } else {
        this.bMovementHorizontal = true
      }
    }

    if (this.bMovementVertical) {
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', event.deltaY + 'px')
    }

    if (this.bMovementHorizontal) {
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', event.deltaX + 'px')
    }
  }

  onEnd_Video(ev) {
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
          this.oPlayer.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.getNextUnit()?.id)
          this.hideSidebar()
          this.bProgressUpdaterRunning = false
          setTimeout(() => {
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

              // after swipe showing video player in the middle again
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

              // play next unit
              this.svWebinar.setNextUnit(this.oPlayer.currentTime())

            },
            this.TRANSITION_VIDEO_SWIPE * 1000);
        }

        if (ev.deltaY > 0) {
          // swipe down --> last video

          // transition is set and after swipe taken away for instant movement in onSwipeMove()
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', this.hVideoWrapper + 'px')

          // set video poster with enough time to load before end of swipe
          this.oPlayer.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.lastUnit()?.id)
          this.hideSidebar()
          this.bProgressUpdaterRunning = false
          setTimeout(() => {
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

              // after swipe showing video player in the middle again
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

              // play last unit
              this.svWebinar.setUnit(this.svWebinar.lastUnit(), this.oPlayer.currentTime())
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
          // right interval
          // transition is set and after swipe taken away for instant movement in onSwipeMove()
          this.pauseVideo(false)
          const nextIntervalTime = this.getNextIntervalTime()
          console.log(nextIntervalTime)
          if (nextIntervalTime) {
            this.oPlayer.currentTime(nextIntervalTime)
          } else {
            this.svWebinar.setNextUnit(this.oPlayer.currentTime())
          }

          this.svAnimation.moveHorizontal(this.videoWrapper, -this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', 0 + 'px')
            this.playVideo()
          })
        }

        if (ev.deltaX > 0) {
          // left interval
          this.pauseVideo(false)
          this.oPlayer.currentTime(this.getLastIntervalTime())
          this.svAnimation.moveHorizontal(this.videoWrapper, +this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', 0 + 'px')
            this.playVideo()
            console.log(this.getLastIntervalTime())
          })
        }
      }
    }
  }


  onStart_ProgressBar() {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'flex')
  }

  onMove_ProgressBar(ev) {
    this.bProgressUpdaterRunning = false;
    this.stopProgressUpdater()

    // set process bar according to process move
    const pProgress_ = (ev.center.x / this.wWindow) * 100
    this.renderer.setStyle(this.vProgressBar.nativeElement, 'width', pProgress_ + '%')

    this.pProgress = Math.round(pProgress_)

    this.imgProgressThumbnail = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.svWebinar.bsUnit.value?.lProgressThumbnails[this.pProgress]);

    // position x-axis thumbnail
    const dimenProgressThumbnail = this.vProgressThumbnail.nativeElement.getBoundingClientRect()

    let position = ((this.pProgress * this.wWindow) / 100) - (dimenProgressThumbnail.width / 2)
    if (position <= 0) {
      position = 0
    }
    if (position >= (this.wWindow - (dimenProgressThumbnail.width))) {
      position = this.wWindow - dimenProgressThumbnail.width
    }
    this.renderer.setStyle(this.vProcessThumbnail.nativeElement, 'left', (position + 'px'))

    if (!this.oPlayer.paused()) this.pauseVideo(false)
  }

  onEnd_ProgressBar(ev) {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'none')
    this.oPlayer.currentTime(this.oPlayer.duration() * (ev.center.x / this.wWindow))
    this.playVideo()
    this.startProgressUpdater()
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




  startProgressUpdater() {
    this.bProgressUpdaterRunning = true

    this.stopProgressUpdater()
    this.startProgressObserver()

    this.oProgressUpdater = interval(this.INTERVAL_PROGRESS_UPDATER).subscribe(val => {
      if (this.bProgressUpdaterRunning) {
        this.updateProgressBar(this.oPlayer.currentTime(), this.oPlayer.duration())

        if (this.svWebinar.bsUnit.value?.oUnitPlayer?.tStatus! < 2) {
          const secOverEnd = this.oPlayer.duration() - this.oPlayer.currentTime()
          if (secOverEnd <= this.TIME_SIDEBAR_END) {
            if (!this.bSidebarShown) {
              this.bSidebarHidden = false
              this.bSidebarShown = true
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
            this.svAnimation.show([this.vSidebar])
          }
        }

        // information
        const secOverStart = this.TIME_INFORMATION_START - this.oPlayer.currentTime()
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

  stopProgressUpdater() {
    if (this.oProgressUpdater !== undefined) this.oProgressUpdater.unsubscribe()
    this.stopProgressObserver()
  }

  startProgressObserver() {
    this.oProgressObserver = interval(this.INTERVAL_PROGRESS_OBSERVER).subscribe(val => {
      if (this.bProgressUpdaterRunning) {
        if (this.svWebinar.bsUnitInterval.value !== null) {
          if (this.oPlayer.currentTime() > this.svWebinar.bsUnitInterval.value?.secEnd || this.oPlayer.currentTime() < this.svWebinar.bsUnitInterval.value?.secStart) {
            this.setNewUnitInterval()
          }
        } else {
          this.setNewUnitInterval()
        }

        this.updateIntervalThumbnails()
      }
    })
  }

  stopProgressObserver() {
    if (this.oProgressObserver !== undefined) this.oProgressObserver.unsubscribe()
  }

  updateProgressBar(secCurrent, secTotal) {
    this.vProgressBar.nativeElement.style.width = (secCurrent / secTotal) * 100 + '%'
  }


  setNewUnitInterval() {
    if (this.svWebinar.bsUnitInterval.value === null || this.svWebinar.bsUnitInterval.value!.index !== this.svWebinar.bsUnit.value?.lIntervals[Math.floor(this.oPlayer.currentTime() / this.SEC_VIDEO_INTERVAL)]!.index) {
      this.svWebinar.bsUnitInterval.next(this.svWebinar.bsUnit.value?.lIntervals[Math.floor(this.oPlayer.currentTime() / this.SEC_VIDEO_INTERVAL)]!)
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

  onEventUnit(event: any) {
    switch (event.cEvent) {

      // unit selected
      case 'select':
        if (!this.bClickListInsideDisabled) {
          // upload status and time of current unit
          let aUnitOld: Unit = event.unitOld
          if (aUnitOld !== null) {
            aUnitOld.oUnitPlayer!.tStatus = 1
            aUnitOld.oUnitPlayer!.secVideo = this.getVideoTime()
            this.svWebinar.uploadUnitPlayer(aUnitOld.oUnitPlayer)
          }

          this.hideSidebar()
          this.bProgressUpdaterRunning = false
          this.svWebinar.setUnit(event.unit)
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


  setupPlayer() {
    let options = {
      fluid: false,
      fill: true,
      autoplay: false,
      controls: false,
    }

    this.oPlayer = videojs.default(this.video?.nativeElement, options, undefined)

    // TODO add environment variable for dev and prod mode
    this.oPlayer.volume(environment2.VOLUME_VIDEO)

    // ended callback
    this.oPlayer.on('ended', data => {
      this.bProgressUpdaterRunning = false
      this.svWebinar.setNextUnit()
    });

    // play callback
    this.oPlayer.on('play', data => {
      this.setVideoSpeed()
    });

    // pause callback
    this.oPlayer.on('pause', data => {
    });
  }

  playUnit(unit: Unit | null, play: boolean = true) {
    this.updatePlayer(this.api.getUrl('webinar/unit/video/' + unit?.id), play)
  }

  updatePlayer(source: string, play: boolean = true) {
    if (this.oPlayer !== undefined) {
      this.oPlayer.src({src: source, type: 'video/mp4'});
      if (play) this.playVideo()
    }
  }

  playVideo() {
    this.setNewUnitInterval()
    if (this.oPlayer.paused() || true) {
      // set so that the video starts when coming back after swipe gesture on cover
      if (!this.bDocumentInteraction) {
        this.renderer.setStyle(this.vPlay.nativeElement, 'opacity', 0)
        this.bDocumentInteraction = true
      }

      this.startProgressUpdater()
      this.oPlayer.play()
    }
  }

  pauseVideo(bShowInformation = true) {
    if (!this.oPlayer.paused()) {
      this.oPlayer.pause()
      this.stopProgressUpdater()

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
      if (aVideoSpeed.id === this.ksVideoSpeed) this.oPlayer.playbackRate(aVideoSpeed.speedFactor)
    })
  }

  setVideoTime(secTime) {
    this.oPlayer.currentTime(secTime)
  }

  getVideoTime() {
    if (this.oPlayer !== null) {
      return this.oPlayer.currentTime()
    } else {
      return 0
    }
  }

  onClick_TabHome() {
    this.router.navigate(['start'])
  }


  onClick_Share() {
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


  onClick_Check() {
    this.svAnimation.iconClick(this.vCheckAnimation)
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.bsUnit.value!.oUnitPlayer!.tStatus = this.svWebinar.bsUnit.value?.oUnitPlayer?.tStatus == 2 ? 1 : 2
    console.log(this.svWebinar.bsUnit.value!.oUnitPlayer!)
    this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value!.oUnitPlayer!)
  }


  onClickVideo() {
    if (!this.onCloseList()) {
      if (this.oPlayer.paused()) {
        if (this.bDocumentInteraction) {
          this.svAnimation.popup(this.vPlay)
        }
        this.playVideo()
      } else {
        this.pauseVideo()
        this.svAnimation.popup(this.vPause)
      }
    }
  }

  onClick_Note(aNote: Note) {
    this.setVideoTime(aNote.secTime)
    this.cpListNotes.onCloseList()
  }

  onClick_NoteSettings(aNote: Note) {
    this.svWebinar.bsNote.next(aNote)
    this.cpListActionNotes.show()
  }

  onClick_NoteAdd($event) {
    const data = {
      kWebinar: this.svWebinar.bsWebinar.value?.id,
      kUnitPlayer: this.svWebinar.bsUnit.value?.oUnitPlayer?.id,
      kUnit: this.svWebinar.bsUnit.value?.id,
      secTime: this.oPlayer.currentTime(),
      cNote: $event,
    }
    this.api.safePut('note', data, (aNote: Note) => {
      console.log(aNote)
      this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes?.push(aNote)
      this.svWebinar.sortNotes()
      console.log('note added: toast')
    })
  }

  onClick_EditNote($event) {
    this.svWebinar.bsNote.value.cNote = $event

    const data = {
      kNote: this.svWebinar.bsNote.value.id,
      cNote: $event,
    }
    this.api.safePost('note', data, (aNote: Note) => {
      console.log(aNote)
      this.svWebinar.bsNote.next(null)
      console.log('note edited: toast')
    })
  }

  onClick_DeleteNote() {
    this.api.safeDelete('note/' + this.svWebinar.bsNote.value.id, () => {
      this.cpListActionNotes.onCloseList()
      this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.forEach((item, index) => {
        if (item === this.svWebinar.bsNote.value) this.svWebinar.bsUnit.value?.oUnitPlayer?.lNotes!.splice(index, 1);
      });
      this.svWebinar.bsNote.next(null)
      console.log('note deleted')
    })
  }


  onClick_InputAddNote() {
    this.svWebinar.bsNote.next(null)
    this.cpListInputAddNote.show()
  }

  onClick_InputEditNote() {
    this.cpListActionNotes.onCloseList()
    this.cpListInputEditNote.show(this.svWebinar.bsNote.value.cNote)
  }


  onClick_AddComment($event) {
    const data = {
      kWebinar: this.svWebinar.bsWebinar.value?.id,
      kUnit: this.svWebinar.bsUnit.value?.id,
      cText: $event,
    }
    this.api.safePut('comment', data, (aComment: Comment) => {
      this.svWebinar.bsUnit.value!.nComments++
      this.svWebinar.bsUnit.value?.lComments?.push(aComment)
      this.svWebinar.sortComments()
      console.log('comment added: toast')
    })
  }

  onClick_EditComment($event) {
    this.svWebinar.bsComment.value!.cText = $event

    const data = {
      kComment: this.svWebinar.bsComment.value?.id,
      cText: $event,
    }
    this.api.safePost('comment', data, (aComment: Comment) => {
      console.log(aComment)
      this.svWebinar.bsComment.next(null)
      console.log('comment edited: toast')
    })
  }

  onClick_DeleteComment() {
    this.api.safeDelete('comment/' + this.svWebinar.bsComment.value?.id, () => {
      this.svWebinar.bsUnit.value!.nComments--
      this.cpListActionComments.onCloseList()
      this.svWebinar.bsUnit.value?.lComments!.forEach((item, index) => {
        if (item === this.svWebinar.bsComment.value) this.svWebinar.bsUnit.value?.lComments!.splice(index, 1);
      });
      this.svWebinar.bsComment.next(null)
    })
  }

  onClick_InputAddComment() {
    this.svWebinar.bsComment.next(null)
    this.cpListInputAddComment.show()
  }


  onClick_InputEditComment() {
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


  onClick_InputAddCommentAnswer(aComment: Comment | null = null) {
    if (this.scrollCheckListComments()) {
      if (aComment) {
        this.svWebinar.bsComment.next(aComment)
        this.showListCommentAnswers(aComment)
      }
      this.showInputAddCommentAnswer()
    }
  }

  onClick_InputAddCommentAnswerRegard(aCommentAnswerRegard: CommentAnswer) {
    if (this.scrollCheckListCommentAnswers()) {
      this.svWebinar.bsCommentAnswerRegard.next(aCommentAnswerRegard)
      this.showInputAddCommentAnswer(aCommentAnswerRegard?.cPlayer)
    }
  }

  showInputAddCommentAnswer(cRegard: string | null = null) {
    this.svWebinar.bsCommentAnswer.next(null)
    this.cpListInputAddCommentAnswer.show('', cRegard, 'Antwort hinzufügen...')
  }

  onClick_CommentLike(aComment: Comment) {
    if (this.scrollCheckListComments()) {
      const data = {
        kComment: aComment.id,
        bLike: aComment.bLike ? 0 : 1
      }
      this.api.safePost('comment/like', data, () => {
        aComment.bLike = !aComment.bLike
        if (aComment.bLike) {
          aComment.nLikes++
        } else {
          aComment.nLikes--
        }
      })
    }
  }

  onClick_CommentSettings(aComment: Comment) {
    if (this.scrollCheckListComments()) {
      if (this.svPlayer.isUser(aComment.kPlayer)) {
        this.svWebinar.bsComment.next(aComment)
        this.cpListActionComments.show()
      } else {
        // TODO: report
      }
    }
  }

  onClick_InputEditCommentAnswer() {
    this.cpListActionCommentAnswers.onCloseList()
    this.cpListInputEditCommentAnswer.show(this.svWebinar.bsCommentAnswer.value?.cText, this.svWebinar.bsCommentAnswerRegard.value?.cPlayer)
  }

  onClick_DeleteCommentAnswer() {
    this.api.safeDelete('comment-answer/' + this.svWebinar.bsCommentAnswer.value?.id, () => {
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

  onClick_AddCommentAnswer($event: any) {
    // add note
    let aCommentAnswerRegard: CommentAnswer | null = this.svWebinar.bsCommentAnswerRegard.value

    const data = {
      kComment: this.svWebinar.bsComment.value?.id,
      cText: $event,
      kPlayerRegard: aCommentAnswerRegard !== null ? aCommentAnswerRegard.kPlayer : null
    }
    this.api.safePut('comment-answer', data, (aCommentAnswer: CommentAnswer) => {
      console.log(aCommentAnswer)
      this.svWebinar.bsComment.value?.lCommentAnswers?.push(aCommentAnswer)
      this.svWebinar.bsComment.value!.nAnswers++
      console.log(this.svWebinar.bsComment.value?.lCommentAnswers)
      console.log('comment-answer added: toast')
    })
  }

  onClick_EditCommentAnswer($event: any) {
    // edit note
    this.svWebinar.bsCommentAnswer.value!.cText = $event

    const data = {
      kCommentAnswer: this.svWebinar.bsCommentAnswer.value?.id,
      cText: $event,
    }
    this.api.safePost('comment-answer', data, (response: any) => {
      this.svWebinar.bsCommentAnswer.next(null)
      console.log('comment-answer edited: toast')
    })
  }

  onClick_CommentAnswerSettings(aCommentAnswer: CommentAnswer) {
    if (this.scrollCheckListCommentAnswers()) {
      if (aCommentAnswer.kPlayer === this.svPlayer.bsUserData.value?.id) {
        this.svWebinar.bsCommentAnswer.next(aCommentAnswer)
        this.cpListActionCommentAnswers.show()
      } else {
        // TODO: report
      }
    }
  }

  onClick_CommentAnswerLike(aCommentAnswer: CommentAnswer) {
    if (this.scrollCheckListCommentAnswers()) {
      let data = {
        kCommentAnswer: aCommentAnswer.id,
        bLike: aCommentAnswer.bLike ? 0 : 1
      }
      console.log(data)
      this.api.safePost('comment-answer/like', data, () => {
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
    this.api.safePost('player/filter-comments', {kFilterComments: kSelectedFilter}, null)
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

  onClick_Comments() {
    this.svAnimation.iconClick(this.vUnitCommentAnimation)
    this.cpListComments.onOpenList()
    this.orderComments()
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

  onClick_UnitLike() {
    this.svAnimation.iconClick(this.vUnitLikeAnimation)

    this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike = !this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike
    this.svWebinar.bsUnit.value!.nLikes = this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike ? this.svWebinar.bsUnit.value!.nLikes + 1 : this.svWebinar.bsUnit.value!.nLikes - 1

    const data = {
      kUnitPlayer: this.svWebinar.bsUnit.value!.oUnitPlayer!.id,
      bLike: this.svWebinar.bsUnit.value!.oUnitPlayer!.bLike ? 1 : 0
    }
    this.api.safePost('webinar/auth/unit-player/like', data, null)
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
    this.api.safePost('webinar-player/video-speed', data, null)

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
    this.api.safeGetFile('webinar/auth/unit/material/' + this.svWebinar.bsUnit.value?.id + '/' + aMaterial.cName, (blob: any) => {
      this.uFile.openBlob(blob)
    })
  }

  onClick_Replay() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'none');
    this.oPlayer.currentTime(0)
    this.playVideo()
  }

  onClick_Play() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'none');
    this.playVideo()
  }

  on_ListOpened() {
    this.pauseVideo()
  }

  on_ListClosed() {
    this.playVideo()
  }

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
    const currentTime = this.oPlayer.currentTime()
    const currentInterval = this.svWebinar.bsUnitInterval.value?.index!
    const nextInterval = (currentTime % this.SEC_VIDEO_INTERVAL) < 25 ? currentInterval + 1 : currentInterval + 2
    if (nextInterval <= this.svWebinar.bsUnit.value?.lIntervals.length!) {
      return nextInterval
    }
    return null
  }

  getLastInterval() {
    const currentTime = this.oPlayer.currentTime()
    const currentInterval = this.svWebinar.bsUnitInterval.value?.index!
    const nextInterval = (currentTime % this.SEC_VIDEO_INTERVAL) > 5 ? currentInterval - 1 : currentInterval - 2
    if (nextInterval >= 0) {
      return nextInterval
    }
    return 0
  }


  hideSidebar() {
    console.log('HHIIIDE')
    this.renderer.setStyle((this.vSidebar.nativeElement), 'transition', '0s')
    this.renderer.setStyle(this.vSidebar.nativeElement, 'opacity', 0)
    this.renderer.setStyle((this.vSidebar.nativeElement), 'transition', 'all 200ms ease-in-out')
    this.bSidebarShown = false
    this.bSidebarHidden = true
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

  setDimensions() {
    this.hVideoWrapper = this.videoWrapper.nativeElement.offsetHeight
    this.wVideoWrapper = this.videoWrapper.nativeElement.offsetWidth
    this.heightList = this.vList.nativeElement.offsetHeight
    this.hWindow = window.innerHeight
    this.wWindow = window.innerWidth;

    // height of list-outside (container of the list-inside with constant height)
    this.hListOutside = this.vListOutside.nativeElement.offsetHeight
  }
}
