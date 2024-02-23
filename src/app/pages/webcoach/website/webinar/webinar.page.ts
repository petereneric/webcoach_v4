/*** last-refactoring: 14.01.2024 by eric ***/

import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Unit} from "../../../../interfaces/unit";
import {ApiService} from "../../../../services/api/api.service";
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
import {ItemSectionComponent} from "../../../../components/webinar/item-section/item-section.component";

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.page.html',
  styleUrls: ['./webinar.page.sass'],
  providers: [MainMenuService, DateTime],
})

export class WebinarPage implements OnInit, AfterViewInit, OnDestroy {

  // views
  @ViewChild('vCheckAnimation') vCheckAnimation!: ElementRef
  @ViewChild('vCover') vCover!: ElementRef
  @ViewChild('vInformation') vInformation!: ElementRef
  @ViewChild('vInputNote') vInputNote!: ElementRef
  @ViewChild('vListHeader') vListHeader!: ElementRef
  @ViewChild('vListInside') vListInside!: ElementRef
  @ViewChild('vListInsideCommentAnswers') vListInsideCommentAnswers!: ElementRef
  @ViewChild('vListInsideComments') vListInsideComments!: ElementRef
  @ViewChild('vListInsideDescription') vListInsideDescription!: ElementRef
  @ViewChild('vListInsideNotes') vListInsideNotes!: ElementRef
  @ViewChild('vListInsideOverview') vListInsideOverview!: ElementRef
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
  @ViewChild('vVideoContainer') vVideoContainer!: ElementRef
  @ViewChild('vContainer') vContainer!: ElementRef
  @ViewChild('vCoverBoxWebinar') vCoverBoxWebinar!: ElementRef
  @ViewChild('vCoverBoxSection') vCoverBoxSection!: ElementRef
  @ViewChild('vCoverBoxUnit') vCoverBoxUnit!: ElementRef

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
  @ViewChild('cpListOverview') cpListOverview!: ListSliderComponent
  @ViewChild('cpItemSection') cpItemSection!: ItemSectionComponent

  // constants
  readonly THRESHOLD_COVER_SCROLL = 0.005
  readonly THRESHOLD_VIDEO_VELOCITY = 0.25 // px/ms
  readonly THRESHOLD_LIST_VELOCITY = 1.5 // px/ms
  readonly THRESHOLD_LIST_HEADER_VELOCITY = 0.30 // px/ms
  readonly THRESHOLD_LIST_INSIDE_VELOCITY = 0.30 // px/ms
  readonly TRANSITION_VIDEO_SWIPE = 0.35 // s
  readonly TRANSITION_LIST_SWIPE = environment.TRANSITION_LIST_SWIPE // s
  readonly INTERVAL_PROGRESS_UPDATER = 300 // ms // fewer triggers for and back in the beginning
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
  private bShowVideoControls: boolean = false
  private pxCoverScroll: number | null = null
  private velocityCoverScroll: number = 0
  private directionCoverScroll: number | null = null // 0 --> down , 1 --> up
  private pCoverScroll: number = 0
  private tsCoverScroll: number = 0
  public testText: string = ""
  private bNewVideoTime: boolean = false
  private bNewVideoSec: number = 0
  private bVideoDelay: boolean = false
  private bPlayAfterSeek: boolean = true

  public testName: string = 'cool'


  constructor(private sanitizer: DomSanitizer, private uFile: File, public svPlayer: PlayerService, public uDateTime: DateTime, private svMenu: MainMenuService, private svCoach: CoachService, private router: Router, private svAnimation: AnimationService, public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private api: ApiService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.resetScroll()
    this.route.params.subscribe(params => {
      const kWebinar = params['kWebinar'];

      this.svWebinar.load(kWebinar);
      this.svWebinar.loadWebinarThumbnail(kWebinar)
      this.svPlayer.downloadUserData()

      this.api.get('webinar/sections-content/' + kWebinar, aContent => this.aContent = aContent)
    })

    this.setupPlayer()

    // callback for change of visibility, e.g. on tab change
    document.addEventListener("visibilitychange", () => {
      switch (document.visibilityState) {
        case "visible":
          break;

        case "hidden":
          this.pauseVideo()
          this.vCover.nativeElement.style.zIndex = 9
          this.resetScroll()
          this.svWebinar.uploadUnitPlayer(this.svWebinar.bsUnit.value?.oUnitPlayer!, () => {
            window.location.reload();
          })

          //this.svWebinar.setCurrentUnitProgress()
          //this.svWebinar.setCurrentSectionProgress()
          //this.svWebinar.setWebinarProgress()




          // scroll to top
          //this.closeAllLists()

          //this.bVisibilityChange = true

          break;
      }
    });
  }


  ngAfterViewInit(): void {

    this.vCover.nativeElement.style.zIndex = 9

    this.setDimensions()

    this.svWebinar.bsWebinarProgress.subscribe(pProgress => {
      this.vCoverBoxWebinar.nativeElement.style.setProperty('--progress-webinar', (pProgress * 360) + 'deg')
    })

    this.svWebinar.bsSectionProgress.subscribe(pProgress => {
      this.vCoverBoxSection.nativeElement.style.setProperty('--progress-section', (pProgress * 360) + 'deg')
    })

    this.svWebinar.bsUnitProgress.subscribe(pProgress => {
      this.vCoverBoxUnit.nativeElement.style.setProperty('--progress-unit', (pProgress * 360) + 'deg')
    })

    this.svWebinar.bsUnit.subscribe(aUnit => {
      if (this.vCover !== undefined && this.vCover.nativeElement.style.zIndex == 0) {
        const kUnit = aUnit?.id
        setTimeout(() => {
          if (kUnit === this.svWebinar.bsUnit.value?.id) {
            aUnit!.nCalls = aUnit!.nCalls + 1
            this.api.safePost('unit/call', {kUnit: kUnit}, null)
          }
        }, 10000)


        this.playUnit(aUnit, false)

        this.updateProgressBar(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.showVideoControls()

        this.svWebinar.updateWebinarPlayer()

        this.showInformation()
        this.showSidebar()
      } else {
        this.playUnit(aUnit, false)

        this.updateProgressBar(aUnit?.oUnitPlayer?.secVideo ?? 0, aUnit?.secDuration)
        this.showVideoControls()
      }
    })

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

    this.svWebinar.bsWebinarPlayer.subscribe(aWebinarPlayer => {
      this.ksVideoSpeed = aWebinarPlayer?.kVideoSpeed!
      this.setVideoSpeed()
    })

    //this.startProgressUpdater()

    // works only on non safari browsers
    this.vUnitLike.nativeElement.addEventListener('pointerdown', event => {
      window.navigator.vibrate(1000)
    });

    this.vContainer.nativeElement.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch.pageX > 20 && touch.pageX < (window.innerWidth - 0)) return
      e.preventDefault();
    })


    this.vCover.nativeElement.addEventListener('touchend', event => {
      let timeout = 200
      setTimeout(() => {
        this.bScrollDisabled = true
        if (this.pCoverScroll >= 1) {
          window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"});

          setTimeout(() => {
            this.renderer.setStyle(this.vCover.nativeElement, 'overflow-y', 'hidden')
            // this.vCover.nativeElement.style.position = 'fixed' --> does not work on ios
            document.body.style.overflowY = "hidden";
          }, 1000)

          console.log("5", this.vCover.nativeElement.overflowY)
          if (this.bDocumentInteraction && document.visibilityState === "visible") this.playVideo()
        } else {
          if ((this.directionCoverScroll === 1 || this.pCoverScroll >= 0.3) && ((this.velocityCoverScroll > 2 && (new Date().getTime() - this.tsCoverScroll) < 50) || this.pCoverScroll >= 0.3)) {
            setTimeout(() => {
              window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"});
              this.vCover.nativeElement.style.zIndex = 0

              setTimeout(() => {
                this.renderer.setStyle(this.vCover.nativeElement, 'overflow-y', 'hidden')
                // this.vCover.nativeElement.style.position = 'fixed' --> does not work on ios
                document.body.style.overflowY = "hidden";
              }, 1000)
              console.log("4", this.vCover.nativeElement.style.overflow)
              if (this.bDocumentInteraction && document.visibilityState === "visible") this.playVideo()
            },)
            return
          } else {
            if (this.pCoverScroll < 0.3) {
              setTimeout(() => {
                // does not scroll back on safari when just little scrolled
                window.scroll({top: 0, left: 0, behavior: "smooth"});
                console.log("3", this.vCover.nativeElement.style.overflow)
              }, 400)
              return
            }
            if (this.pCoverScroll >= 0.3) {
              setTimeout(() => {
                window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"});
                this.vCover.nativeElement.style.zIndex = 0
                setTimeout(() => {
                  this.renderer.setStyle(this.vCover.nativeElement, 'overflow-y', 'hidden')
                  // this.vCover.nativeElement.style.position = 'fixed' --> does not work on ios
                  document.body.style.overflow = "hidden";
                }, 1000)

                console.log("2", this.vCover.nativeElement.style.overflow)
                if (this.bDocumentInteraction && document.visibilityState === "visible") this.playVideo()
              },)
              return
            }

          }
        }

        /*
        setTimeout(() => {
          window.scroll({top: 0, left: 0, behavior: "smooth"});
        }, 400)
         */
      }, timeout);

    });

    this.showSidebar()
    this.showInformation()
  }


  ngOnDestroy(): void {
    this.svWebinar.uploadUnitPlayer()
    this.oPlayer.dispose();
    this.stopProgressUpdater()
    window.scrollTo(0, 0);
    window.location.reload();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    // updating sizes upon change of screen size e.g. when nav bar collapses in browsers like safari
    this.setDimensions()
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.tsCoverScroll = new Date().getTime()
    console.log("scrolling")
    let pScroll: number = Number(Number((((document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight) / this.hWindow)).toFixed(2))
    this.pCoverScroll = pScroll
    this.renderer.setStyle(this.vCover.nativeElement, 'filter', 'blur(' + (pScroll * 5) + 'px)')
    const pxScroll = (document.documentElement.scrollTop || document.body.scrollTop)
    //console.log("pxScroll", pxScroll)
    this.directionCoverScroll = this.pxCoverScroll !== null ? (pxScroll - this.pxCoverScroll) > 0 ? 1 : 0 : 1
    //console.log("direction", this.directionCoverScroll)
    this.velocityCoverScroll = this.pxCoverScroll !== null ? pxScroll - this.pxCoverScroll : 0
    //console.log("velocityCoverScroll", this.velocityCoverScroll)
    this.pxCoverScroll = pxScroll
    this.testName = this.testName + "_" + this.pxCoverScroll + "_"

    if (pScroll >= 1 && this.vCover.nativeElement.style.zIndex !== 0) {
      this.vCover.nativeElement.style.zIndex = 0
      //window.scroll({top: this.vCover.nativeElement.offsetHeight, left: 0, behavior: "auto"}); // causes that the play button cant be pressed / does not react
      //if (this.bDocumentInteraction && document.visibilityState === "visible") this.playVideo()
    }

    // scrolling at the beginning when window is covered for triggered user engagement
    // in order for shrinking the browsers nav bar

    // info: There was a bug on ios which blocked the click on the video screen so that video couldn't be started or stopped
    // It was either solved by setting nScroll === Threshold or by timeout for scroll to bottom or by the order
    // where zIndex is set in the end. In the result user can swipe now and immediately click to play without waiting till scroll bar finished
    // giving only then the click for play free

    // hide cover

    // hereby the video starts playing on scroll when it has been started already
    // Note: player can only be started manually when user interacted with the document
    // for some reason scroll event is triggered when changing tab, therefore a check
    // for visibility is necessary
  }


  onStart_Video() {
    this.bMovementHorizontal = false
    this.bMovementVertical = false
    this.bShowVideoControls = this.vVideoControls.nativeElement.style.display === 'flex'
  }

  onMove_Video(event) {
    this.hideVideoControls()

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

        if (this.bShowVideoControls) this.showVideoControls()

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
              this.svWebinar.setNextUnit()

            },
            this.TRANSITION_VIDEO_SWIPE * 1000);
        }

        if (ev.deltaY > 0) {
          // swipe down --> last video

          // transition is set and after swipe taken away for instant movement in onSwipeMove()
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', this.hVideoWrapper + 'px')

          // set video poster with enough time to load before end of swipe
          this.oPlayer.poster("https://webcoach-api.digital/webinar/unit/thumbnail/" + this.svWebinar.getLastUnit()?.id)
          this.hideSidebar()
          this.bProgressUpdaterRunning = false
          setTimeout(() => {
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

              // after swipe showing video player in the middle again
              this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

              // play last unit
              this.svWebinar.setLastUnit()
              //this.svWebinar.setUnit(this.svWebinar.getLastUnit(), this.oPlayer.currentTime())
            },
            this.TRANSITION_VIDEO_SWIPE * 1000);
        }
      }
    }

    // horizontal movement
    if (this.bMovementHorizontal) {
      if (Math.abs(ev.deltaX) < this.wVideoWrapper / 2 && Math.abs(ev.velocityX) < this.THRESHOLD_VIDEO_VELOCITY) {
        // threshold not reached and therefore bouncing video back - no video change
        if (this.bShowVideoControls) this.showVideoControls()
        this.svAnimation.moveHorizontal(this.videoWrapper, 0, this.TRANSITION_VIDEO_SWIPE, () => {

        })
      } else {
        // threshold reached and therefore bouncing showing either backward of forward winding
        if (ev.deltaX < 0) {
          // right interval
          // transition is set and after swipe taken away for instant movement in onSwipeMove()
          this.pauseVideo(false)
          const nextIntervalTime = this.getNextIntervalTime()

          this.svAnimation.moveHorizontal(this.videoWrapper, -this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            console.log(nextIntervalTime)
            if (nextIntervalTime) {
              this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo! = nextIntervalTime
              this.oPlayer.currentTime(nextIntervalTime)
            } else {
              this.svWebinar.setUnitPlayerTime(0, this.svWebinar.bsUnit.value?.oUnitPlayer!)
              this.svWebinar.setNextUnit()
            }
          })
        }

        if (ev.deltaX > 0) {
          // left interval
          this.pauseVideo(false)


          this.svAnimation.moveHorizontal(this.videoWrapper, +this.wVideoWrapper, this.TRANSITION_VIDEO_SWIPE, () => {
            const lastIntervalTime = this.getLastIntervalTime()
            this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo! = lastIntervalTime
            this.oPlayer.currentTime(lastIntervalTime)
          })
        }
      }
    }
  }


  onStart_ProgressBar() {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'flex')
    if (!this.oPlayer.paused()) this.pauseVideo(false)
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


  }

  onEnd_ProgressBar(ev) {
    this.renderer.setStyle(this.vProcessThumbnails.nativeElement, 'display', 'none')
    console.log("currentTIME", this.oPlayer.duration())
    console.log("currentTIME", ev.center.x)
    console.log("currentTIME", this.wWindow)
    const videoTime = this.oPlayer.duration() * (ev.center.x / this.wWindow)
    //this.bNewVideoTime = true
    //this.bNewVideoSec = videoTime
    this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo! = videoTime

    // in callback seeking play() is called
    this.pauseVideo(false)
    this.oPlayer.currentTime(videoTime)
    //this.playVideo()
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
              this.showSidebar()
            }
          } else {
            if (!this.bSidebarHidden) {
              this.hideSidebar()
            }
          }
        } else {
          if (!this.bSidebarShown) {
            this.showSidebar()
          }
        }

        // information
        const secOverStart = this.TIME_INFORMATION_START - this.oPlayer.currentTime()
        if (secOverStart > 0) {
          if (!this.bInformationShown) {
            this.showInformation()
          }
        } else {
          let secTimeout = 0
          if (this.bVisibilityChange) {
            secTimeout = this.TIME_INFORMATION_START
            this.bVisibilityChange = false
          }
          if (!this.bInformationHidden) {
            this.hideInformation(secTimeout)
          }
        }

      }
    });
  }

  showInformation() {
    this.bInformationHidden = false
    this.bInformationShown = true
    this.svAnimation.show([this.vInformation, this.vTitle])
  }

  hideInformation(secTimeout) {
    this.bInformationHidden = true
    this.bInformationShown = false
    this.svAnimation.hide([this.vInformation, this.vTitle], secTimeout)
  }

  showSidebar() {
    this.bSidebarHidden = false
    this.bSidebarShown = true
    this.svAnimation.show([this.vSidebar])
  }

  hideSidebar() {
    this.bSidebarHidden = true
    this.bSidebarShown = false
    this.svAnimation.hide([this.vSidebar])
  }


  stopProgressUpdater() {
    if (this.oProgressUpdater !== undefined) this.oProgressUpdater.unsubscribe()
    this.stopProgressObserver()
  }

  startProgressObserver() {
    this.oProgressObserver = interval(this.INTERVAL_PROGRESS_OBSERVER).subscribe(val => {
      if (this.bProgressUpdaterRunning) {
        this.svWebinar.setUnitPlayerTime(this.oPlayer.currentTime(), this.svWebinar.bsUnit.value?.oUnitPlayer!)

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
    // needed so that there are no jumps in the beginning
    const pWidth = Math.floor((secCurrent / secTotal) * 100 * 100) / 100
    this.vProgressBar.nativeElement.style.width = pWidth + '%'
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
        console.log("item clickk")
        if (this.scrollCheckListOverview()) {
          // upload status and time of current unit
          let aUnitOld: Unit = event.unitOld
          if (aUnitOld !== null) {
            aUnitOld.oUnitPlayer!.tStatus = 1
            aUnitOld.oUnitPlayer!.secVideo = this.getVideoTime()
            //this.svWebinar.updateUnitPlayer(aUnitOld.oUnitPlayer!)
          }

          this.hideSidebar()
          this.bProgressUpdaterRunning = false
          this.svWebinar.setUnit(event.unit)
          this.cpListOverview.onCloseList()
        }
        break

      // unit checked
      case 'check':
        if (this.scrollCheckListOverview()) {
          this.svWebinar.checkUnitPlayer(event.unit.oUnitPlayer)
        }

        break
      case 'collapse':
        // timeout needed so that collapse can take effect in first place
        if (this.scrollCheckListOverview()) {
          event.oSection!.bExpand = !event.oSection!.bExpand
          setTimeout(() => {
              this.cpListOverview.bounceAfterCollapse()
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
        }
        break
    }
  }


  setupPlayer() {
    let options = {
      fluid: false,
      fill: true,
      autoplay: false, // default false
      controls: false,
    }

    this.oPlayer = videojs.default(this.video?.nativeElement, options, undefined)

    // TODO add environment variable for dev and prod mode
    this.oPlayer.volume(environment2.VOLUME_VIDEO)

    // check if needed TODO

    // ended callback
    this.oPlayer.on('ended', data => {
      this.bProgressUpdaterRunning = false
      this.svWebinar.setUnitPlayerTime(0, this.svWebinar.bsUnit.value?.oUnitPlayer!)
      this.svWebinar.setNextUnit()
    });

    this.oPlayer.on('seeked', data => {
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'left', 0 + 'px')
      if (this.oPlayer.paused()) this.oPlayer.play()
    })

    // play callback
    this.oPlayer.on('play', data => {
      this.setVideoSpeed()

      if (this.bNewVideoTime) {
        // this is needed on ios to bring balance to currentTime and wanted time since this can be different
        if (this.oPlayer.currentTime() !== this.bNewVideoSec) {
          // there is a dis balance on safari especially
          this.oPlayer.pause()
          this.bNewVideoTime = false
          this.oPlayer.currentTime(this.svWebinar.bsUnit.value?.oUnitPlayer?.secVideo ?? 0)
          this.oPlayer.play()
          this.startProgressUpdater()
        } else {
          this.startProgressUpdater()
        }
      } else {
        this.startProgressUpdater()
      }
    });


    // pause callback
    this.oPlayer.on('pause', data => {
    });
  }

  playUnit(unit: Unit | null, play: boolean = true) {
    this.updatePlayer(unit, this.api.getUrl('webinar/unit/video/' + unit?.id), play)
  }

  updatePlayer(aUnit: Unit | null, source: string, play: boolean = true) {
    if (this.oPlayer !== undefined) {
      this.oPlayer.src({src: source, type: 'video/mp4'});

      // DO NOT SET CURRENT TIME HERE
      this.bNewVideoTime = true
      this.bNewVideoSec = aUnit?.oUnitPlayer?.secVideo ?? 0

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

      this.hideVideoControls()


      this.oPlayer.play()


    }
  }

  pauseVideo(bShowInformation = true) {
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

  setVideoSpeed() {
    this.lVideoSpeed.forEach(aVideoSpeed => {
      if (aVideoSpeed.id === this.ksVideoSpeed) this.oPlayer.playbackRate(aVideoSpeed.speedFactor)
    })
  }

  setVideoTime(secTime) {
    this.oPlayer.currentTime(secTime)
  }

  getVideoTime() {
    return this.svWebinar.bsUnit.value?.oUnitPlayer?.secVideo ?? 0
    /*
    if (this.oPlayer !== null) {
      return this.oPlayer.currentTime()
    } else {
      return 0
    }

     */
  }

  onClick_TabHome() {
    this.router.navigate(['/buchungen'])
  }

  onClick_TabOverview() {
    console.log(this.aHeights)
    const pxPositionOne = (this.aHeights.pxHeightSection * (this.svWebinar.bsSection.value!.nPosition)) + 2
    const pxUnitGap = this.aHeights.pxHeightUnit * (this.svWebinar.bsUnit.value!.nPosition + 1) + this.aHeights.pxHeightSection
    const pxPositionTwo = this.aHeights.pxHeightSection * (this.svWebinar.bsSection.value!.nPosition + 1) +
      this.aHeights.pxHeightUnit * (this.svWebinar.bsUnit.value!.nPosition > 0 ? (this.svWebinar.bsUnit.value!.nPosition - 1) : this.svWebinar.bsUnit.value!.nPosition)
    this.cpListOverview.scrollPosition({pxPositionOne: pxPositionOne, pxUnitGap: pxUnitGap, pxPositionTwo: pxPositionTwo})
    this.cpListOverview.onOpenList()
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
    this.svWebinar.checkUnitPlayer()
  }


  onClickVideo() {
    console.log("ne")
    if (true) {
      if (this.oPlayer.paused()) {
        if (this.bDocumentInteraction) {
          if (!this.isVideoControls()) this.svAnimation.popup(this.vPlay)
        }
        this.playVideo()
      } else {
        this.pauseVideo()
        this.svAnimation.popup(this.vPause)
      }
    }
  }

  onClick_Note(aNote: Note) {
    if (this.scrollCheckListNotes()) {
      this.setVideoTime(aNote.secTime)
      this.cpListNotes.onCloseList()
    }
  }

  onClick_NoteSettings(aNote: Note) {
    if (this.scrollCheckListNotes()) {
      this.svWebinar.bsNote.next(aNote)
      this.cpListActionNotes.show()
    }
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
      this.svWebinar.bsSections.value?.forEach(aSection => {
        aSection.lUnits.forEach(aUnit => {
          if (aUnit.id === this.svWebinar.bsUnit.value?.id) {
            console.log("jooooNOOO", aUnit.oUnitPlayer!.nNotes)
            aUnit.oUnitPlayer!.nNotes = aUnit.oUnitPlayer!.nNotes + 1
            console.log("joooo", aUnit.oUnitPlayer!.nNotes)
          }

        })
      })
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
      this.svWebinar.bsSections.value?.forEach(aSection => {
        aSection.lUnits.forEach(aUnit => {
          if (aUnit.id === this.svWebinar.bsUnit.value?.id) aUnit.oUnitPlayer!.nNotes = aUnit.oUnitPlayer!.nNotes - 1
        })
      })
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
    console.log("showListCommentAnswers")
    if (this.scrollCheckListComments()) {
      this.svWebinar.bsComment.next(aComment)
      if (aComment.nAnswers > 0) this.svWebinar.loadCommentAnswers(aComment)
      this.cpListComments.showListTwo()
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
      console.log(data)
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

  scrollCheckListOverview() {
    if (this.cpListOverview.bClickBlocked) return false
    if (this.cpListOverview.isScrolling()) {
      console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
      //if (this.cpListOverview.)
      this.cpListOverview.stopScrolling(this.vListInsideOverview)
      return false
    }
    console.log("YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEES")
    return true
  }

  scrollCheckListNotes() {
    if (this.cpListNotes.bClickBlocked) return false
    if (this.cpListNotes.isScrolling()) {
      this.cpListNotes.stopScrolling(this.vListInsideNotes)
      return false
    }
    return true
  }

  scrollCheckListComments() {
    if (this.cpListComments.bClickBlocked) return false
    if (this.cpListComments.isScrolling()) {
      this.cpListComments.stopScrolling(this.vListInsideComments)
      return false
    }
    return true
  }

  scrollCheckListCommentAnswers() {
    if (this.cpListComments.bClickBlocked) return false
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
    this.hideVideoControls()
    this.svWebinar.bsUnit.value!.oUnitPlayer!.secVideo! = 0
    console.log("jo")
    this.playVideo()
  }

  onClick_Play() {
    this.hideVideoControls()
    this.playVideo()
  }

  hideVideoControls() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'none')
  }

  showVideoControls() {
    this.renderer.setStyle(this.vVideoControls.nativeElement, 'display', 'flex')
    if (this.getVideoTime() > 2) {
      this.renderer.setStyle(this.vReplayStart.nativeElement, 'display', 'flex')
    } else {
      this.renderer.setStyle(this.vReplayStart.nativeElement, 'display', 'none')
    }
  }

  isVideoControls() {
    return this.vVideoControls.nativeElement.style.display === 'flex'
  }

  on_ListOpened() {
    this.pauseVideo(false)
  }

  on_ListClosed() {
    this.playVideo()
  }

  on_ListOverviewClosed() {
    this.svWebinar.bsSections.value?.forEach(section => {
      section.bExpand = section.id === this.svWebinar.bsUnit.value?.kSection
    })
    this.on_ListClosed()
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

  closeAllLists() {
    this.cpListOverview.onCloseList(true)
    this.cpListNotes.onCloseList(true)
    this.cpListComments.onCloseList(true)
    this.cpListActionMaterial.onCloseList()
    this.cpListActionComments.onCloseList()
    this.cpListActionCommentAnswers.onCloseList()
    this.cpListActionNotes.onCloseList()
    this.cpListActionSettings.onCloseList()
    this.cpListActionVideoSpeed.onCloseList()
  }

  setDimensions() {
    this.hVideoWrapper = this.videoWrapper.nativeElement.offsetHeight
    this.wVideoWrapper = this.videoWrapper.nativeElement.offsetWidth
    this.hWindow = window.innerHeight
    this.wWindow = window.innerWidth;
  }
}
