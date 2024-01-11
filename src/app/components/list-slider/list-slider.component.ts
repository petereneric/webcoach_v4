import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {environment} from "../../../environments/environment";
import {AnimationService} from "../../services/animation.service";
import {ActionMenuComponent} from "../action-menu/action-menu.component";

@Component({
  selector: 'app-list-slider',
  templateUrl: './list-slider.component.html',
  styleUrls: ['./list-slider.component.sass']
})
export class ListSliderComponent implements OnInit, AfterViewInit {

  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vListOutside') vListOutside!: ElementRef
  @ViewChild('vListOutsideTwo') vListOutsideTwo!: ElementRef
  @ViewChild('vListInsideOrigin') vListInsideOrigin!: ElementRef
  @ViewChild('vListHeader') vListHeader!: ElementRef
  @ViewChild('vInput') vInput!: ElementRef
  @ViewChild('vInputTwo') vInputTwo!: ElementRef
  @ViewChild('vHeaderTwo') vHeaderTwo!: ElementRef
  @ViewChild('vFilterOne', {read: ElementRef}) vFilterOne!: ElementRef
  @ViewChild('vFilterOneMenu', {read: ElementRef}) vFilterOneMenu!: ElementRef
  @ViewChild('cpFilterMenuOne') cpFilterMenuOne!: ActionMenuComponent
  @ContentChild('tpListInside') tpListInside!: TemplateRef<any>
  @ContentChild('tpListInsideTwo') tpListInsideTwo!: TemplateRef<any>
  @ContentChild('tpInput') tpInput!: TemplateRef<any>
  @ContentChild('tpInputTwo') tpInputTwo!: TemplateRef<any>

  @Input('vListInside') vListInside!: ElementRef
  @Input('vListInsideTwo') vListInsideTwo!: ElementRef
  @Input('cHeaderOneTitle') cHeaderOneTitle: string = ""
  @Input('cHeaderOneSubtitle') cHeaderOneSubtitle: string = ""
  @Input('cHeaderTwoTitle') cHeaderTwoTitle: string = ""
  @Input('cHeaderTwoSubtitle') cHeaderTwoSubtitle: string = ""
  @Input('bHandleClick') bHandleClick: boolean = true
  @Input('bFilterOne') bFilterOne: boolean = false
  @Input('lFilterOne') lFilterOne: any[] = []

  @Output() outputListOpened: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputListClosed: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputFilterOneSelect: EventEmitter<number> = new EventEmitter<number>()

  readonly THRESHOLD_LIST_VELOCITY = 1.5 // px/ms
  readonly THRESHOLD_LIST_HEADER_VELOCITY = 0.30 // px/ms
  readonly THRESHOLD_LIST_INSIDE_VELOCITY = 0.30 // px/ms
  readonly TRANSITION_LIST_SWIPE = environment.TRANSITION_LIST_SWIPE // s
  readonly DIRECTION_LIST_START_UP = 1
  readonly DIRECTION_LIST_START_DOWN = 2

  private offsetTopListInsideStart = 0
  private offsetTopListStart = 0
  private heightList = 0
  private hListOutside = 0
  private bClickListInsideDisabled = true
  private bScrollListInsideEnabled = false
  private hWindow = 0
  public wWindow = 0
  public hInput = 0

  public bShowFilterOne = false

  private bPress = false

  public posFilterOne = {x: 0, y: 0}

  // data object for heights of section and unit
  public aHeights = {pxHeightSection: 0, pxHeightUnit: 0}

  // tracker for list of units
  private bListOpen = false

  // used to respect threshold only in the beginning of the scroll
  private tDirectionListStart = 0

  constructor(private renderer: Renderer2, private svAnimation: AnimationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setPositionFilterOne()
    this.setHeight()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // updating sizes upon change of screen size e.g. when nav bar collapses on ios
    this.setHeight()
  }


  onListHeaderStart(event: any) {
    this.offsetTopListStart = this.vList.nativeElement.offsetTop
  }


  onListHeaderMove(event: any) {
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
      const secTransitionListClose = restList / event.velocityY / 1000

      this.svAnimation.slideOut(this.vList, secTransitionListClose, () => {
        this.onCloseList(false)
      })
    } else {
      // bounce back
      console.log("bounce back")
      this.svAnimation.moveVertical(this.vList, this.offsetTopListStart, this.TRANSITION_LIST_SWIPE)
    }
  }

  /*
  onListInsideTap($event) {
    // tap enables click on item, normal build in click would be to sensitive since too much movement is allowed
    this.bClickListInsideDisabled = false
    console.log("onListInsideTap()")
  }
   */

  onListInsidePressTwo(event) {
    this.onListInsidePress(event, this.vListInsideTwo)
  }

  onListInsidePress(event: any | null, vListInside: ElementRef = this.vListInside) {
    this.bPress = true
    console.log("onPress()")
    console.log("scrolling: ", this.bScrollListInsideEnabled)
    if (this.bHandleClick || true) {
      // needed when list fades already in one direction but needs to be interrupted due to new touch and possibly different scroll direction
      console.log("onListInsidePress")
      ///this.bScrollListInsideEnabled = false
      if (event === null || (event.deltaY == 0 && event.deltaX == 0)) {
        // disable scrolling so that there is no bouncing which otherwise is applied after a timeout of fading
        //this.stopScrolling(vListInside)

        // for testing if this prevents the onClick in webinar-vert to be fired

        this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')
        console.log('vListInsideOffsetTop: ', vListInside.nativeElement.offsetTop)
        console.log('vListHeaderOffsetHeight: ', this.vListHeader.nativeElement.offsetHeight)
        this.renderer.setStyle(vListInside.nativeElement, 'top', vListInside.nativeElement.offsetTop - this.vListHeader.nativeElement.offsetHeight + 'px')
      }
    }
  }

  onListInsidePressUp() {
    console.log("onPressUp()")
    setTimeout(() => {
      console.log("onPressUp() and set scrolling false")
      this.bPress = false
      this.bScrollListInsideEnabled = false
    }, 50)
    this.bounce()
  }

  stopScrolling(vListInside: ElementRef = this.vListInside) {
    /* General explanation
    There was a problem with stopping scrolling through a simple click while scrolling, which caused not only a stop but ALSO an action which triggered the
    opening call for list two. Therefore, a solution was needed which only stopped scrolling and nothing more. Two variables were introduced, bScrollListInsideEnabled
    (aka bScrolling) and bPress. If they are true no further action is taken. They were set to false in different parts, but since the onClick Event was triggered after
    all other events like pressUp a setTimeout was needed so that the order is the following:
    1. pressUp (start timeout for setting scrolling and bPress to true)
    2. click (no action) since scrolling and bPress is true
    3. set scrolling and bPress to false
     */

    console.log("stopScrolling")
    setTimeout(() => {
      this.bScrollListInsideEnabled = false
    }, 200)

    this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')
    this.renderer.setStyle(vListInside.nativeElement, 'top', vListInside.nativeElement.offsetTop - this.vListHeader.nativeElement.offsetHeight + 'px')
    this.bounce(vListInside)
  }


  onListInsideStartTwo(event) {
    this.onListInsideStart(event, this.vListInsideTwo)
  }

  onListInsideStart(event: any, vListInside: ElementRef = this.vListInside) {
    // enable scrolling
    //this.bScrollListInsideEnabled = true
    this.bScrollListInsideEnabled = true

    // reset transition so that action takes place immediately
    this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')

    // offsetTop of list
    this.offsetTopListStart = this.vList.nativeElement.offsetTop

    // offsetTop of list-inside (start would be the height of the list-header)
    this.offsetTopListInsideStart = vListInside.nativeElement.offsetTop

    // disables effect of click on item so that only tap can enable it which is not so sensitive
    this.bClickListInsideDisabled = true

    // saving the information whether user started to scroll up or down in the beginning
    this.tDirectionListStart = event.deltaY > 0 ? this.DIRECTION_LIST_START_UP : this.DIRECTION_LIST_START_DOWN
  }

  onListInsideMoveTwo(event) {
    console.log("move TWOOOOOOOOO")
    this.onListInsideMove(event, this.vListInsideTwo)
  }

  onListInsideMove(event: any, vListInside: ElementRef = this.vListInside) {

    const hListInside = vListInside.nativeElement.offsetHeight
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
    console.log('gapListInsideOutside: ' + gapListInsideOutside)


    if (this.hListOutside >= hListInside) {
      // list-inside is smaller than list-outside and therefore no scrolling of list-inside

      if (topListInsideNew >= 0) {
        // animation closing of list
        console.log("animation list closinggg")

        this.svAnimation.moveVertical(this.vList, this.offsetTopListStart + topListInsideNew)
      }
    } else {
      // scrolling of list-inside within its boundaries
      console.log("scrolling of list-inside within its boundaries")

      if (topListInsideNew >= gapListInsideOutside && topListInsideNew <= 0) {
        console.log("actual scrolling")

        console.log(vListInside)
        //this.renderer.setStyle(this.vListInsideTwo.nativeElement, 'top', topListInsideNew + 'px')
        this.svAnimation.moveVertical(vListInside, topListInsideNew)
      }

      if (topListInsideNew > 0) {
        console.log("animation list closing")

        this.svAnimation.moveVertical(this.vList, this.offsetTopListStart + topListInsideNew)
      }

      if (topListInsideNew < gapListInsideOutside) {
        console.log("animation overstretching with decreasing impact due to square algorithm")

        this.svAnimation.moveVertical(vListInside, gapListInsideOutside - Math.pow(Math.abs(topListInsideNew - gapListInsideOutside), 0.75))
      }
    }
  }

  onListInsideEndTwo(event) {
    this.onListInsideEnd(event, this.vListInsideTwo)
  }

  onListInsideEnd(event: any, vListInside: ElementRef = this.vListInside) {
    console.log("ON LIST INSIDE END")
    console.log("------------------")
    // overstretching only possible when user released press/touch not while holding

    this.bPress = false

    // values
    const velocityY = event.velocityY;
    const deltaY = event.deltaY;
    const offsetTopListInside = vListInside.nativeElement.offsetTop
    const hListHeader = this.vListHeader.nativeElement.offsetHeight
    const topListInside = offsetTopListInside - hListHeader
    const hListInside = vListInside.nativeElement.offsetHeight
    const hListOutside = this.vListOutside.nativeElement.offsetHeight
    const gapListInsideOutside = this.hListOutside - hListInside
    const offsetTopList = this.vList.nativeElement.offsetTop
    const movementList = offsetTopList - this.offsetTopListStart
    const middleList = this.heightList / 2

    // console outputs
    console.log('VELOCITY: ' + event.velocityY)
    console.log('topListInsideOld: ' + topListInside)
    console.log('DELTA: ' + event.deltaY)
    console.log('movementList: ' + movementList)
    console.log('middleList: ' + middleList)

    if (velocityY !== 0) {
      this.bScrollListInsideEnabled = true
    } else {
      console.log("set scrolling false on ListInsideEnd 1")
      if (!this.bPress) this.bScrollListInsideEnabled = false
    }

    if (hListInside > hListOutside && topListInside >= gapListInsideOutside && ((deltaY < 0 && velocityY < this.THRESHOLD_LIST_INSIDE_VELOCITY) || (deltaY > 0 && velocityY > this.THRESHOLD_LIST_INSIDE_VELOCITY) && topListInside < 0) && velocityY !== 0) {
      this.bScrollListInsideEnabled = true
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
        this.renderer.setStyle(vListInside.nativeElement, 'transition', secScroll + 's ease-out')
        this.renderer.setStyle(vListInside.nativeElement, 'top', topListInsideEnd + 'px')

        // code is executed after fadeout
        setTimeout(() => {
            this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')

            console.log(this.bPress)
            if (topListInsideEnd < gapListInsideOutside && this.bScrollListInsideEnabled && !this.bPress) {
              // bScrollListInsideEnabled checks if scroll was interrupted by another press/touch on the list
              // topListInsideEnd overstretched the boundary therefore bouncing back
              console.log("topListInsideEnd overstretched the boundary therefore bouncing back")

              this.svAnimation.moveVertical(vListInside, gapListInsideOutside, this.TRANSITION_LIST_SWIPE, () => {
                console.log("set scrolling false on ListInsideEnd 2")
                if (!this.bPress) this.bScrollListInsideEnabled = false
              })
            } else {
              console.log("set scrolling false on ListInsideEnd 3")
              if (!this.bPress) this.bScrollListInsideEnabled = false
              this.bounce()
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
        this.renderer.setStyle(vListInside.nativeElement, 'transition', secScroll + 's ease-out')
        this.renderer.setStyle(vListInside.nativeElement, 'top', topListInsideEnd + 'px')


        // code is executed after fadeout
        setTimeout(() => {
            this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')

            if (movementList <= 0 && topListInsideEnd > 0 && this.bScrollListInsideEnabled && !this.bPress) {
              // bScrollListInsideEnabled checks if scroll was interrupted by another press/touch on the list
              // topListInsideEnd overstretched the boundary therefore bouncing back
              console.log("topListInsideEnd overstretched the boundary therefore bouncing back")

              this.svAnimation.moveVertical(vListInside, 0, this.TRANSITION_LIST_SWIPE, () => {
                console.log("set scrolling false on ListInsideEnd 4")
                if (!this.bPress) this.bScrollListInsideEnabled = false
              })
              setTimeout(() => {
                  this.renderer.setStyle(vListInside.nativeElement, 'transition', '0s')
                },
                this.TRANSITION_LIST_SWIPE * 1000);
            } else {
              console.log("set scrolling false on ListInsideEnd 5")
              if (!this.bPress) this.bScrollListInsideEnabled = false
              this.bounce()
            }
          },
          secScroll * 1000);
      }
    }

    // list movement > 0
    if (movementList >= middleList || (movementList > 0 && (event.velocityY >= this.THRESHOLD_LIST_VELOCITY && event.deltaY > 0))) {
      // list is moved more than half or less but fast enough
      // closing list
      console.log("closing list")

      this.bScrollListInsideEnabled = true

      const offsetTopList = this.vList.nativeElement.offsetTop
      const restList = this.hWindow - offsetTopList

      // close list
      console.log("close list")
      console.log(event.velocityY)
      console.log(restList)
      const secTransitionListClose = restList / event.velocityY / 1000

      this.svAnimation.moveVertical(this.vList, this.hWindow, secTransitionListClose, () => {
        this.bListOpen = false
        console.log("set scrolling false on ListInsideEnd 6")
        if (!this.bPress) this.bScrollListInsideEnabled = false
      })
    }

    if (movementList < middleList && (movementList > 0 && event.velocityY < this.THRESHOLD_LIST_VELOCITY && event.deltaY > 0)) {
      // movement less than half and velocity too low for closing therefore bounce back
      console.log("movement less than half and velocity too low for closing therefore bounce back")

      this.bScrollListInsideEnabled = true

      this.svAnimation.moveVertical(this.vList, this.offsetTopListStart, this.TRANSITION_LIST_SWIPE, () => {
        console.log("set scrolling false on ListInsideEnd 7")
        if (!this.bPress) this.bScrollListInsideEnabled = false
      })
    }

    // list inside
    if (gapListInsideOutside > 0) {
      this.bScrollListInsideEnabled = true
      this.svAnimation.moveVertical(vListInside, 0, this.TRANSITION_LIST_SWIPE, () => {
        console.log("set scrolling false on ListInsideEnd 8")
        if (!this.bPress) this.bScrollListInsideEnabled = false
      })
    } else {
      if (topListInside < gapListInsideOutside) {
        this.bScrollListInsideEnabled = true
        // bounce back list-inside on bottom when user overstretched the list already while holding it
        console.log("bounce back list-inside on bottom when user overstretched the list already while holding it")

        this.svAnimation.moveVertical(vListInside, hListOutside - hListInside, this.TRANSITION_LIST_SWIPE, () => {
          console.log("set scrolling false on ListInsideEnd 9")
          if (!this.bPress) this.bScrollListInsideEnabled = false
        })
      }
    }
  }

  onCloseList(bAnimation = true) {
    if (this.bListOpen) {

      this.bListOpen = false
      //this.bScrollListInsideEnabled = true

      // output
      this.outputListClosed.emit()

      // animation
      if (bAnimation) this.svAnimation.slideOut(this.vList, environment.TRANSITION_LIST_SWIPE, () => {
        console.log("set scrolling false on listClose 10")
        this.bScrollListInsideEnabled = false
      })

      // list closed and video played
      return true
    }
    // nothing happened cause list was already closed
    return false

  }

  onOpenList() {
    if (!this.bListOpen) {

      this.bListOpen = true

      // output
      this.outputListOpened.emit()

      // animation
      this.svAnimation.slideIn(this.vList)
    }
  }

  setHeight() {
    this.heightList = this.vList.nativeElement.offsetHeight
    this.hListOutside = this.vListOutside.nativeElement.offsetHeight
    this.hWindow = window.innerHeight
    this.wWindow = window.innerWidth
    this.hInput = this.vInput.nativeElement.offsetHeight
    this.renderer.setStyle(this.vListOutside.nativeElement, 'height', 'calc(100% - 4rem - ' + this.hInput + 'px)')
    this.hListOutside = this.vListOutside.nativeElement.offsetHeight
    this.renderer.setStyle(this.vListOutside.nativeElement, 'margin-bottom', this.hInput + 'px)')
  }


  showListTwo() {
    console.log("showListTwo()")
    this.svAnimation.swingIn(this.vListOutsideTwo)
    this.svAnimation.swingIn(this.vInputTwo)
    this.svAnimation.swingIn(this.vHeaderTwo, 0.3)
  }

  hideListTwo() {
    this.svAnimation.swingOut(this.vListOutsideTwo, 0.3)
    this.svAnimation.swingOut(this.vInputTwo)
    this.svAnimation.swingOut(this.vHeaderTwo)
  }

  isScrolling(): boolean {
    return this.bScrollListInsideEnabled
  }

  onListInsideClick(event) {
    console.log("onListInsideClick()")
    event.stopPropagation()
  }

  onTap() {
    console.log("onTap()")
    if (this.bScrollListInsideEnabled) this.stopScrolling()
    this.bounce()
  }

  bounce(vListInside: ElementRef = this.vListInside) {
    if (this.checkForBouncingBackFromBottom(vListInside)) this.bounceBackBottom(vListInside)
    if (this.checkForBouncingBackFromTop(vListInside)) this.bounceBackTop(vListInside)
  }

  checkForBouncingBackFromTop(vListInside: ElementRef = this.vListInside) {
    const offsetTopList = this.vList.nativeElement.offsetTop
    const movementList = offsetTopList - this.offsetTopListStart
    const offsetTopListInside = vListInside.nativeElement.offsetTop
    const hListHeader = this.vListHeader.nativeElement.offsetHeight
    const topListInside = offsetTopListInside - hListHeader

    return movementList <= 0 && topListInside > 0
  }

  checkForBouncingBackFromBottom(vListInside: ElementRef = this.vListInside) {
    const offsetTopListInside = vListInside.nativeElement.offsetTop
    const hListHeader = this.vListHeader.nativeElement.offsetHeight
    const topListInside = offsetTopListInside - hListHeader
    const hListInside = vListInside.nativeElement.offsetHeight
    const gapListInsideOutside = this.hListOutside - hListInside

    console.log("checkForBouncingBackFromBottom", topListInside < gapListInsideOutside)

    return topListInside < gapListInsideOutside
  }

  bounceBackTop(vListInside: ElementRef = this.vListInside) {
    this.svAnimation.moveVertical(vListInside, 0, this.TRANSITION_LIST_SWIPE, () => {
      console.log("set scrolling false on ListInsideEnd 14")
    })
  }

  bounceBackBottom(vListInside: ElementRef = this.vListInside) {
    const hListInside = vListInside.nativeElement.offsetHeight
    const gapListInsideOutside = this.hListOutside - hListInside
    this.svAnimation.moveVertical(vListInside, gapListInsideOutside, this.TRANSITION_LIST_SWIPE, () => {
      console.log("set scrolling false on ListInsideEnd 12")
      //if (!this.bPress) this.bScrollListInsideEnabled = false
    })
  }

  setPositionFilterOne() {
    let dimenFilterOne = this.vFilterOne.nativeElement.getBoundingClientRect()
    let dimenList = this.vList.nativeElement.getBoundingClientRect()
    this.posFilterOne.x = dimenFilterOne.x + dimenFilterOne.width / 2
    this.posFilterOne.y = dimenFilterOne.y - dimenList.y + dimenFilterOne.height
  }

  showFilterMenuOne() {
    this.bShowFilterOne = true
    this.setPositionFilterOne()
    this.cpFilterMenuOne.show()
  }

  onFilterMenuOneSelect($event: number) {
    this.outputFilterOneSelect.emit($event)
  }
}

