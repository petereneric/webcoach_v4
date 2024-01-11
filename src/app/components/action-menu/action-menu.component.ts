import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {PlayerService} from "../../services/data/player.service";
import {Player} from "../../interfaces/player";

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.sass']
})

export class ActionMenuComponent implements OnInit, AfterViewInit {

  @ViewChild('vContainer') vContainer!: ElementRef
  @ViewChild('vArrowUp') vArrowUp!: ElementRef
  @ViewChild('vScreen') vScreen!: ElementRef

  @Input('lMenu') lMenu: any[] = []
  @Input('kSelected') kSelected: number | undefined = 1
  @Input('posPointer') posPointer: any

  @Output() outputSelect: EventEmitter<number> = new EventEmitter<number>()

  constructor(private renderer: Renderer2, public svPlayer: PlayerService) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    let dimenFilterOne = this.vContainer.nativeElement.getBoundingClientRect()
    let dimenList = this.vContainer.nativeElement.getBoundingClientRect()
    console.log(dimenList)
    console.log(this.vContainer)
    console.log((dimenFilterOne.y + (dimenFilterOne.height/2)))
    //this.renderer.setStyle(this.vContainer.nativeElement, 'top', (dimenFilterOne.y - dimenList.y  + (dimenFilterOne.height/2)) + 'px')
    console.log(this.posPointer)
    //this.renderer.setStyle(this.vContainer.nativeElement, 'top', this.posPointer.y + 'px')
    //this.renderer.setStyle(this.vContainer.nativeElement, 'left', this.posPointer.x + 'px')

    console.log( this.vContainer.nativeElement.getBoundingClientRect())
  }

  public show() {
    this.renderer.setStyle(this.vContainer.nativeElement, 'visibility', 'visible')
    this.renderer.setStyle(this.vArrowUp.nativeElement, 'visibility', 'visible')
    this.renderer.setStyle(this.vScreen.nativeElement, 'display', 'block')

    // arrow-up
    let dimenArrowUp = this.vArrowUp.nativeElement.getBoundingClientRect()
    this.renderer.setStyle(this.vArrowUp.nativeElement, 'left', (this.posPointer.x - dimenArrowUp.width/2)+ 'px')
    console.log("posPointerY: ", this.posPointer.y)
    this.renderer.setStyle(this.vArrowUp.nativeElement, 'top', (this.posPointer.y) + 'px')

    console.log(this.posPointer)
    let dimenContainer = this.vContainer.nativeElement.getBoundingClientRect()
    console.log("" + ((dimenContainer.width/2 + parseInt(getComputedStyle(document.documentElement).fontSize)) + this.posPointer.x))
    console.log("jo")
    dimenArrowUp = this.vArrowUp.nativeElement.getBoundingClientRect()

    console.log("jo", (dimenArrowUp.y + dimenArrowUp.height))

    if ((((dimenContainer.width/2 + parseInt(getComputedStyle(document.documentElement).fontSize)) + this.posPointer.x)) > window.innerWidth) {
      this.renderer.setStyle(this.vContainer.nativeElement, 'left', (window.innerWidth - dimenContainer.width - parseInt(getComputedStyle(document.documentElement).fontSize)) + 'px')
      this.renderer.setStyle( this.vContainer.nativeElement, 'left', (dimenArrowUp.x + dimenArrowUp.width - dimenContainer.width) + (parseInt(getComputedStyle(document.documentElement).fontSize))/2 + 'px')
    } else {
      this.renderer.setStyle(this.vContainer.nativeElement, 'left', this.posPointer.x + 'px')
    }

    console.log("top", (dimenArrowUp.y + dimenArrowUp.height - dimenContainer.y))
    console.log("1", (dimenArrowUp.y))
    console.log("2", (dimenArrowUp.height))
    console.log("3", (dimenContainer.y))
    this.renderer.setStyle(this.vContainer.nativeElement, 'top', (this.posPointer.y + dimenArrowUp.height) + 'px')



  }

  hide() {
    this.renderer.setStyle(this.vScreen.nativeElement, 'display', 'none')
    this.renderer.setStyle(this.vContainer.nativeElement, 'visibility', 'hidden')
    this.renderer.setStyle(this.vArrowUp.nativeElement, 'visibility', 'hidden')
  }

  onSelect(kSelect) {
    this.hide()
    this.outputSelect.emit(kSelect)
  }

  onScreen() {
    this.hide()
  }
}
