import {AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Unit} from "../../../../interfaces/unit";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Communication} from "../../../../services/communication/communication.service";
import * as videojs from "video.js";
import {interval, Subscription} from "rxjs";
import {WebinarService} from "../../../../services/data/webinar.service";
import {AnimationService} from "../../../../services/animation.service";

@Component({
  selector: 'app-webinar-vert',
  templateUrl: './webinar-vert.page.html',
  styleUrls: ['./webinar-vert.page.scss'],
})
export class WebinarVertPage implements OnInit, AfterViewInit, OnDestroy {

  // view-children
  @ViewChild('vSwipe') vSwipe!: ElementRef
  @ViewChild('videoWrapper') videoWrapper!: ElementRef
  @ViewChild('videoBottom') videoBottom!: ElementRef
  @ViewChild('videoTop') videoTop!: ElementRef
  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vProcess') vProcess!: ElementRef
  @ViewChild('vTabs') vTabs!: ElementRef
  @ViewChild('vCover') vCover!: ElementRef
  @ViewChild('vPlay') vPlay!: ElementRef
  @ViewChild('vPause') vPause!: ElementRef
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined

  // output
  @Output('long-press') onPress: EventEmitter<any> = new EventEmitter()
  @Output('long-press-up') onPressUp: EventEmitter<any> = new EventEmitter()

  // constants
  readonly THRESHOLD_COVER_SCROLL = 3
  readonly THRESHOLD_VIDEO_SWIPE = 200 // px
  readonly THRESHOLD_VIDEO_VELOCITY = 0.02 // px
  readonly TRANSITION_VIDEO_SWIPE = 0.35 // s
  readonly INTERVAL_PROCESS_UPDATER = 100 // ms

  // tracker for list of units
  private bListOpen = false

  // gets changed in function setHeight()
  private hVideoWrapper = 0

  // needed for process
  private wWindow = 0

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

  constructor(private router: Router, private svAnimation: AnimationService, public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    // get kWebinar and start service that loads webinar
    this.activatedRoute.params.subscribe(params => {
      this.svWebinar.load(params['kWebinar']);
    })

    // initiate player
    this.setPlayer()

    // checker for process
    this.startProcessUpdater()

    // subscription to unit change
    this.svWebinar.bsUnit.subscribe(aUnit => {
      this.playUnit(aUnit)
    })

    // callback for change of visibility, e.g. on tab change
    // for coming back from other tab and primary putting cover on top before that
    // also needed for reloading page and before that putting scroll to top
    document.addEventListener("visibilitychange", (event) => {
      switch (document.visibilityState) {
        case "visible":
          break;
        case "hidden":
          this.player.pause()
          // put cover on top
          this.vCover.nativeElement.style.zIndex = 7
          // scroll to top
          this.resetScroll()
          break;
      }
    });
  }


  ngAfterViewInit(): void {
    // initial size calls
    this.setHeight()
    this.wWindow = window.innerWidth;

    // this.vCover.nativeElement.style.top = "0px"
  }


  ngOnDestroy(): void {
    this.player.dispose();
    this.stopProcessUpdater()

    // close slider
    this.svAnimation.slideOut30(this.vList)
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

    if (this.nScroll > this.THRESHOLD_COVER_SCROLL) {
      // scrolling at the beginning when window is covered for triggered user engagement
      // in order for shrinking nav bar in ios mobile devices

      // hide cover
      this.vCover.nativeElement.style.zIndex = 0

      // hereby the video starts playing on scroll when it has been started already
      // Note: player can only be started manually when user interacted with the document
      // for some reason scroll event is triggered when changing tab, therefore a check
      // for visibility is necessary
      if (this.bDocumentInteraction && this.documentVisible()) this.player.play()
    }
  }


  onSwipeMove($event) {
    // change vertical position of videoWrapper according to user swipe movement
    this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', $event.deltaY + 'px')
  }


  onSwipeEnd(ev) {
    console.log(ev.deltaY)
    console.log(ev)
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
        // swipe up

        // transition is set and after swipe taken away for instant movement in onSwipeMove()
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', -this.hVideoWrapper + 'px')
        setTimeout(() => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

            // after swipe showing video player in the middle again
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

            // play next unit
            this.svWebinar.nextUnit()
          },
          this.TRANSITION_VIDEO_SWIPE * 1000);
      }

      if (ev.deltaY > 0) {
        // swipe down

        // transition is set and after swipe taken away for instant movement in onSwipeMove()
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', this.TRANSITION_VIDEO_SWIPE + 's')
        this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', this.hVideoWrapper + 'px')
        setTimeout(() => {
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')

            // after swipe showing video player in the middle again
            this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

            // play last unit
            this.svWebinar.setUnit(this.svWebinar.lastUnit())
          },
          this.TRANSITION_VIDEO_SWIPE * 1000);
      }
    }
  }


  onProcessMove(ev) {
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
    // only called after real movement with delta values bigger than zero

    // update current video time according to process end move
    this.player.currentTime(this.player.duration() * (ev.center.x / this.wWindow))

    // start process updater again and overtake current video time for updating the process bar
    this.startProcessUpdater()

    // start video again
    this.player.play()
  }


  onOpenList() {
    if (!this.bListOpen) {
      this.bListOpen = true

      // pause video
      this.pauseVideo()

      // animation
      this.svAnimation.slideIn30(this.vList)
    }
  }


  onCloseList() {
    if (this.bListOpen) {
      this.bListOpen = false

      // play video
      this.playVideo()

      // animation
      this.svAnimation.slideOut30(this.vList)
    }

  }


  onTabHome() {
    this.router.navigate(['home'])
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
        // upload status and time of current unit
        let aUnitOld: Unit = event.unitOld
        if (aUnitOld !== null) {
          aUnitOld.oUnitPlayer!.tStatus = 1
          aUnitOld.oUnitPlayer!.secVideo = this.getTime()
          this.svWebinar.uploadUnitPlayer(aUnitOld)
        }

        // set selected unit
        this.svWebinar.setUnit(event.unit)

        // close list
        this.onCloseList()

        break;

      // unit checked
      case 'check':
        // upload status and time of checked unit
        let unit = event.unit
        unit.oUnitPlayer!.tStatus = unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0
        unit.oUnitPlayer!.secVideo = 0
        this.svWebinar.uploadUnitPlayer(unit)

        break;
    }
  }

  setPlayer() {
    let options = {
      fluid: false,
      fill: true,
      autoplay: true,
      controls: false,
      poster: 'assets/image/eric_schumacher.jpg'
    }

    this.player = videojs.default(this.video?.nativeElement, options, function () {})

    // TODO add environment variable for dev and prod mode
    this.player.volume(0)

    // ended callback
    this.player.on('ended', data => {
      this.svWebinar.nextUnit()
    });

    // play callback
    this.player.on('play', data => {
      // set so that the video starts when coming back after swipe gesture on cover
      if (!this.bDocumentInteraction) this.bDocumentInteraction = true

      // start process update for updating process bar
      this.startProcessUpdater()
    });

    // pause callback
    this.player.on('pause', data => {
      this.stopProcessUpdater()
    });
  }


  playUnit(unit: Unit | null) {
    this.updatePlayer(this.connApi.getUrl('webinar/unit/video/' + unit?.id))
  }

  playVideo() {
    if (this.player.paused()) this.player.play()
  }

  pauseVideo() {
    if (!this.player.paused()) this.player.pause()
  }


  updatePlayer(source: string) {
    if (this.player !== undefined) {
      this.player.src({src: source, type: 'video/mp4'});
      this.player.poster('assets/logo/webcoach.webp')
      this.player.play();
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
  }


  onClickVideo() {
    this.onCloseList()

    if (this.player.paused()) {
      // play
      this.player.play()

      // animation of play icon
      this.svAnimation.popup(this.vPlay)

    } else {
      // pause
      this.player.pause()

      // animation of pause icon
      this.svAnimation.popup(this.vPause)
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
}
