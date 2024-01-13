import {AfterViewInit, Component, ContentChild, ElementRef, HostListener, Input, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {AnimationService} from "../../services/animation.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-list-action',
  templateUrl: './list-action.component.html',
  styleUrls: ['./list-action.component.sass']
})
export class ListActionComponent implements OnInit, AfterViewInit{

  @ContentChild('tpListInside') tpListInside!: TemplateRef<any>
  @ViewChild('vList') vList!: ElementRef
  @ViewChild('vClickScreen') vClickScreen!: ElementRef

  @Input('cHeader') cHeader: string = ''
  @Input('bMargin') bMargin: boolean = false

  // variables
  hWindow: number = 0
  private offsetTopListStart = 0
  private heightList = 0

  constructor(private svAnimation: AnimationService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setHeight()
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
  }

  show() {
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'block')
    this.svAnimation.backgroundOpacityIn(this.vClickScreen)
    this.svAnimation.slideIn(this.vList)
  }

  onCloseList() {
    console.log("close action list")
    this.svAnimation.backgroundOpacityOut(this.vClickScreen, () => {
      this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
      console.log("display none");
    })
    this.svAnimation.slideOut(this.vList)
  }

  onListStart($event) {
    this.offsetTopListStart = this.vList.nativeElement.offsetTop
  }

  onListMove(event) {
    if (event.deltaY >= 0) {
      console.log(event.deltaY)
      console.log("list closing")

      let topListInsideNew = this.offsetTopListStart + event.deltaY

      topListInsideNew = topListInsideNew - environment.THRESHOLD_PAN

      if (topListInsideNew > this.offsetTopListStart) {
        this.renderer.setStyle(this.vList.nativeElement, 'top', topListInsideNew + 'px')
      }
    }
  }

  onListEnd(event) {
    const offsetTopList = this.vList.nativeElement.offsetTop
    const middleList = this.heightList / 2
    const movementList = offsetTopList - this.offsetTopListStart
    const restList = this.hWindow - offsetTopList

    if (movementList >= middleList || (event.velocityY >= 0.15 && event.deltaY > 0)) {
      // close list
      const secTransitionListClose = restList / event.velocityY / 1000

      this.svAnimation.slideOut(this.vList, secTransitionListClose > 0.25 ? 0.25 : secTransitionListClose, () => {this.onCloseList()})
    } else {
      // bounce back
      console.log("bounce back")
      this.svAnimation.moveVertical(this.vList, this.offsetTopListStart, 0.15)
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight()
  }

  setHeight() {
    this.heightList = this.vList.nativeElement.offsetHeight
    this.hWindow = window.innerHeight
  }

}
