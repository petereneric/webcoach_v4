import {AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Webinar} from "../../../../interfaces/webinar";
import {Section} from "../../../../interfaces/section";
import {Unit} from "../../../../interfaces/unit";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Communication} from "../../../../services/communication/communication.service";
import {VjsPlayerComponent} from "../../../../components/vjs-player/vjs-player.component";
import * as videojs from "video.js";
//import 'web-animations-js'
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {interval, Subscription} from "rxjs";
import {WebinarService} from "../../../../services/data/webinar.service";

@Component({
  selector: 'app-webinar-vert',
  templateUrl: './webinar-vert.page.html',
  styleUrls: ['./webinar-vert.page.scss'],
})
export class WebinarVertPage implements OnInit, AfterViewInit, AfterViewChecked {

  // view-children
  @ViewChild('vGesture') vGesture!: ElementRef
  @ViewChild('videoWrapper') videoWrapper!: ElementRef
  @ViewChild('videoBottom') videoBottom!: ElementRef
  @ViewChild('videoTop') videoTop!: ElementRef
  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vProcess') vProcess!: ElementRef
  @ViewChild('vTabs') vTabs!: ElementRef
  @ViewChild('vTabIconHome') vTabIconHome!: ElementRef
  @ViewChild('vTabIconList') vTabIconList!: ElementRef
  @ViewChild('vCover') vCover!: ElementRef
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined

  classPlay = 'icon-play-pause'
  classPause = 'icon-play-pause'

  private animation!: Animation
  private animationTwo!: Animation
  private started = false
  private initialStep = 0
  private bList = false
  public hVideoContainer = 0
  private wWindow = 0
  bHeightCalled = false;
  heightSmall = 0
  heightBig = 0
  private firstVideo = false
  private interaction = false

  private scrollCounter = 1
  private freezeScrollCounter = false
  private counterScroll = 0

  private noPlay = false

  // player
  player!: videojs.default.Player;

  el!: HTMLElement
  @Output('long-press') onPress: EventEmitter<any> = new EventEmitter()
  @Output('long-press-up') onPressUp: EventEmitter<any> = new EventEmitter()

  // data
  kWebinar: number | null = null
  oWebinar: Webinar | null = null
  lSections: Section[] | null = null
  oUnit: Unit | null = null

  subscription!: Subscription;

  constructor(public svWebinar: WebinarService, private renderer: Renderer2, private svCommunication: Communication, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    document.addEventListener("visibilitychange", (event) => {

      // for coming back from other tab and putting cover on top
      if (document.visibilityState == "visible") {
        this.noPlay = false
        console.log("tab is active")
        this.vCover.nativeElement.style.zIndex = 6


      } else {
        this.player.pause()
        this.noPlay = true;
        this.vCover.nativeElement.style.zIndex = 6
        console.log("tab is inactive")

        this.freezeScrollCounter = true;
        this.scrollCounter = 0
        window.scrollTo(0,0)


        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });


        this.renderer.setStyle(this.vCover.nativeElement, 'top', 0 + 'px')

        this.freezeScrollCounter = false;
      }
    });

    // enables height for player
    //window.VIDEOJS_NO_DYNAMIC_STYLE = true

    this.setPlayer()

    this.setUpChecker()

    this.activatedRoute.params.subscribe(params => {
      this.svWebinar.load(params['kWebinar']);
      //this.svWebinar.load(5);
    })

    // subscription to unit change
    this.svWebinar.bsUnit.subscribe(aUnit => {
      this.playUnit(aUnit)
    })
  }


  ngAfterViewInit(): void {

    setTimeout(() => {

        this.freezeScrollCounter = true;

        window.scrollTo(0,0)


          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });


        this.renderer.setStyle(this.vCover.nativeElement, 'top', 0 + 'px')

        this.freezeScrollCounter = false;
      },
      500);

    // @ts-ignore
    /*
    this.animation = this.animationCtrl
      .create()
      .addElement(this.videoWrapper.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateY(0)', `translateY(${-844}px)`);

     */
    console.log("lets gooo")
    //this.vVideoPlayer.nativeElement.style.height = '2000px'
    //this.vVideoPlayer.nativeElement.style.width = '100px'


    /*
    const gesture = (this.gesture = this.gestureCtrl.create({
      el: this.vGesture.nativeElement,
      threshold: 0,
      gestureName: 'card-drag',
      onMove: (ev) => this.onMove(ev),
      onEnd: (ev) => this.onEnd(ev),
    }));

    gesture.enable(true);


    const gestureTab = (this.gesture = this.gestureCtrl.create({
      el: this.vTabs.nativeElement,
      threshold: 0,
      gestureName: 'swipe',
      onMove: (ev) => this.onMoveProcess(ev),
      onEnd: (ev) => this.onEndProcess(ev),
    }));

    gestureTab.enable(true);


     */

    this.setHeight()
    //this.video!.nativeElement.style.height = heightVideoWrapper + 'px'
    //this.videoBottom.nativeElement.style.top = heightVideoWrapper + 'px'
    //this.videoTop.nativeElement.style.top = (-heightVideoWrapper * 1) + 'px'
    //this.video!.nativeElement.style.top = (-heightVideoWrapper * 1) + 'px'

    /*

    let heightVideoWrapper = this.videoWrapper.nativeElement.offsetHeight
    this.hVideoContainer = heightVideoWrapper
    console.log("Height " + heightVideoWrapper)
    //this.video!.nativeElement.style.height = heightVideoWrapper + 'px'
    this.videoBottom.nativeElement.style.top = heightVideoWrapper + 'px'
    this.videoTop.nativeElement.style.top = (-heightVideoWrapper * 2) + 'px'

     */
    this.wWindow = window.innerWidth;
    console.log("width: " + this.wWindow)


    this.vCover.nativeElement.style.top = "0px"

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.wWindow = window.innerWidth;
    this.bHeightCalled = false
    this.setHeight()
  }

  ngAfterViewChecked() {
    this.setHeight()
    if (!this.bHeightCalled) {
      this.setHeight()
    }
  }


  onMove($event) {
    this.moveVertical($event.deltaY)


    /*
    if (!this.started) {
      console.log("START")
      console.log("deltaY: " + ev.deltaY)
      if (ev.deltaY < 0) {
        this.animation.progressStart()
        console.log("onStart negative")
      } else {
        this.animationTwo.progressStart()
        console.log("onStart positive")
      }
      //this.animation.progressStart()

      this.started = true
    }

    //console.log("Step: ", this.getStep(ev))
    //this.animation.progressStep(this.getStep(ev));
    if (ev.deltaY < 0) {
      console.log("onMove negative")
      //console.log(this.getStep(ev))
      this.animation.progressStep(this.getStep(ev));
    } else {
      this.animationTwo.progressStep(this.getStepTwo(ev));
      console.log("onMove positive")
    }

    const { type, currentY, deltaY, velocityY } = ev;

    //console.log(currentY)
    //console.log(deltaY)
    //console.log(velocityY)
    //

     */


  }


  onEnd(ev) {


    console.log("onEnd")
    console.log(ev.deltaY)

    if (ev.deltaY < 0) {
      // swipe

      //this.renderer.setStyle(this.videoWrapper.nativeElement, 'transform', `rotate(50deg)`);
      this.renderer.addClass(this.videoBottom.nativeElement, 'test');
      this.renderer.addClass(this.videoWrapper.nativeElement, 'test2');
      //this.renderer.setStyle(this.videoWrapper.nativeElement,"transition","2s");
      //this.renderer.setStyle(this.videoBottom.nativeElement, 'background-color', '#2dd36f')

      this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '1s')

      console.log("container: " + this.hVideoContainer)
      // +1 cause of overlap issue
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', -this.hVideoContainer + 1 + 'px')


      setTimeout(() => {
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

          this.svWebinar.nextUnit()
          //this.setNextUnit(this.svCommunication.currentUnit.value)
        },
        1000);


    }

    if (ev.deltaY > 0) {
      console.log("go")
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '1s')

      // -1 cause of overlap issue
      this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', this.hVideoContainer - 1 + 'px')

      setTimeout(() => {
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'transition', '0s')
          this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', 0 + 'px')

          console.log("yakldfjasjdf")
          this.svWebinar.setUnit(this.svWebinar.lastUnit())
          //this.setNextUnit(this.svCommunication.currentUnit.value)
        },
        1000);
    }

    // click
    if (ev.deltaY === 0) {

    }


    console.log("onEnd")
    if (!this.started) {
      console.log("not started")
      return;
    }

    /*
    this.gesture.enable(false)



    if (ev.deltaY < 0) {
      const step = this.getStep(ev)
      console.log(step)
      const shouldComplete = step > 0.5;

      this.animation.progressEnd(shouldComplete ? 1 : 0, step).onFinish(() => {
        this.gesture.enable(true)
        if (shouldComplete) {
          console.log("end negative complete")
          //console.log(this.videoWrapper.nativeElement.offsetTop)
          //this.videoWrapper.nativeElement.style.top = 844 + 'px'
        } else {
          console.log("end negative not complete")
        }
      })

      this.initialStep = shouldComplete ? -844 : 0
      console.log("reset negative initial step")
    } else {
      const stepTwo = this.getStepTwo(ev)
      const shouldCompleteTwo = stepTwo > 0.5;

    }



    this.started = false

    */

    console.log("onEnd")
  }

  onMoveProcess(ev) {
    console.log("jooooooooooo")
    console.log(ev)
    if (ev.deltaX > 0 || ev.deltaX < 0) {
      //this.vProcess.nativeElement.style.transition = '0s'
      this.stopChecker()
      let widthProcess = this.vProcess.nativeElement.offsetWidth
      console.log(widthProcess)
      console.log(ev.currentX)
      this.vProcess.nativeElement.style.width = (ev.currentX / this.wWindow) * 100 + '%'
    }
  }


  onEndProcess(ev) {

    if (ev.deltaX > 0 || ev.deltaX < 0) {
      this.player.currentTime(this.player.duration() * (ev.currentX / this.wWindow))
      this.setUpChecker()
      //this.vProcess.nativeElement.style.transition = '1.1s'
    }


  }


  setUpChecker() {

    const source = interval(100);
    const text = 'Your Text Here';

    this.subscription = source.subscribe(val => {
      let process = this.player.currentTime() / this.player.duration()
      //console.log(process*100)
      this.vProcess.nativeElement.style.width = process * 100 + '%'

    });

  }

  stopChecker() {
    console.log("stop checker")
    this.subscription.unsubscribe()
  }


  private clamp(min: number, n: number, max: number) {
    return Math.max(min, Math.min(n, max));
    /*
    if (n > 0) {
      return Math.max(min, Math.min(n, max));
    } else {
      return Math.min(min, Math.min(n, max));
    }
     */

  }

  /*
  private getStep(ev: GestureDetail) {
    const delta = this.initialStep + ev.deltaY;
    return this.clamp(0, delta / -844, 1);
  }

  private getStepTwo(ev: GestureDetail) {
    const delta = this.initialStep + ev.deltaY;
    return this.clamp(0, delta / 844, 1);
  }

   */

  moveVertical(yDelta: number) {
    console.log("DELTA: " + yDelta)
    this.renderer.setStyle(this.videoWrapper.nativeElement, 'top', yDelta + 'px')
  }

  ngOnDestroy(): void {
    // close video-js player
    this.player.dispose();
    this.subscription.unsubscribe();
  }

  onVideoEvent($event: string) {

  }


  /*
  // update unit-player
  updateUnitPlayer(unit: Unit) {
    // prepare data
    let data = {
      kUnit: unit.id,
      tStatus: unit.oUnitPlayer?.tStatus,
      secVideo: unit.oUnitPlayer?.secVideo,
    }

    // update unit-player settings
    this.connApi.safePost('webinar/auth/unit-player', data, null)

  }

   */

  onClick($event: any) {
    console.log($event)
  }

  playUnit(unit: Unit | null) {
    this.updateSource(this.connApi.getUrl('webinar/unit/video/' + unit?.id))
  }

  updateSource(source: string) {
    if (this.player !== undefined) {
      this.player.src({src: source, type: 'video/mp4'});
      this.player.poster('assets/logo/webcoach.webp')
      if (!this.firstVideo) {
        this.player.play();
      }

    }
  }

  onTabList() {

    // pause video
    this.bList = true
    this.player.pause()

    this.stopChecker()


    console.log("onList()")

    this.renderer.removeClass(this.vList.nativeElement, 'list-open')
    this.renderer.addClass(this.vList.nativeElement, 'list')
    this.renderer.removeClass(this.vList.nativeElement, 'list-close-animation')
    this.renderer.addClass(this.vList.nativeElement, 'list-animation')


  }

  onTabHome() {

  }

  onEventUnit($event: any) {
    // declare unit

    // switch
    switch ($event.cEvent) {

      // unit selected
      case 'select':
        // set status and time to old unit
        let aOldUnit = $event.unitOld
        if (aOldUnit !== null) {
          aOldUnit.oUnitPlayer!.tStatus = 1
          aOldUnit.oUnitPlayer!.secVideo = this.getTime()
          this.svWebinar.uploadUnitPlayer(aOldUnit)
        }


        this.svWebinar.setUnit($event.unit)
        this.closeList()
        break;

      // unit checked
      case 'check':
        // set status and time of checked unit

        let unit = $event.unit
        console.log(unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0)
        unit.oUnitPlayer!.tStatus = unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0
        unit.oUnitPlayer!.secVideo = 0
        this.svWebinar.uploadUnitPlayer(unit)
        break;
    }

    // update unit
    //this.updateUnitPlayer(unit)
  }

  setPlayer() {
    let options = {
      fluid: false,
      fill: true,
      autoplay: true,
      controls: false,
      muted: false,
      poster: 'assets/image/eric_schumacher.jpg'
    }

    this.player = videojs.default(this.video?.nativeElement, options, function () {
    })
    //this.player.volume(0)

    this.player.on('ended', data => {
      this.svWebinar.nextUnit()
    });

    this.player.on('play', data => {
      // for playing video when coming back from other tab
      if (!this.interaction) this.interaction = true

      if (this.firstVideo) this.firstVideo = false

    });
  }

  getTime() {
    if (this.player !== null) {
      return this.player.currentTime()
    } else {
      return 0
    }
  }

  closeList() {
    console.log("list open")
    this.renderer.removeClass(this.vList.nativeElement, 'list')
    this.renderer.addClass(this.vList.nativeElement, 'list-open')
    this.renderer.removeClass(this.vList.nativeElement, 'list-animation')
    this.renderer.addClass(this.vList.nativeElement, 'list-close-animation')
    this.setUpChecker()
  }

  setHeight() {
    let heightVideoWrapper = this.videoWrapper.nativeElement.offsetHeight
    if (heightVideoWrapper > this.hVideoContainer) this.heightBig = heightVideoWrapper
    this.hVideoContainer = heightVideoWrapper
    if (this.hVideoContainer > 0 && this.heightBig > 0) this.bHeightCalled = true
    //console.log("Height " + heightVideoWrapper)
  }


  onClickVideo() {
    //window.scrollTo(0,-40*this.scrollCounter**2)
    this.scrollCounter++


    console.log("click")
    if (this.bList) {
      this.closeList()
    }

    if (this.player.paused()) {
      this.player.play()
      this.setUpChecker()
      console.log("onPlay()")
      this.classPlay = 'icon-play-pause-animation'
      setTimeout(() => {
          this.classPlay = 'icon-play-pause'
        },
        1000);
    } else {
      this.stopChecker()
      this.player.pause()
      //this.subscription.unsubscribe()
      console.log("onPause()")
      this.classPause = 'icon-play-pause-animation'
      setTimeout(() => {
          this.classPause = 'icon-play-pause'
        },
        1000);
    }
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (!this.freezeScrollCounter) this.counterScroll++
    console.log("HIIER")
    console.log(event)
    console.log(this.counterScroll)

    if (this.counterScroll > 3) {
      console.log("YEEESSSSS")
      //this.player.volume(100)
      //this.player.play()
      this.vCover.nativeElement.style.zIndex = 0

      if (this.interaction) {
        if (!this.noPlay) this.player.play()
        console.log("play tab")
      } else {
        console.log("no play")
      }

      //this.vCover.nativeElement.style.display = "none"
      //this.vCover.nativeElement.style.opacity = 0.01
      //this.vMain.nativeElement.style.top = 0 + 'px'
      //this.disableScroll()
    }

  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: MouseEvent) {
    console.log("mouse end")
    console.log(this.counterScroll)

    // for playing video when coming back from other tab

    //this.player.play()


    // needed
    setTimeout(() => {
        //window.scrollTo(0,0)

      /*
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

       */
        //this.renderer.setStyle(this.vCover.nativeElement, 'top', 0 + 'px')
      },
      2000);

  }

  @HostListener('click', ['$event.target']) myClick(e) {
    console.log("KLLLICK")
  }
}
