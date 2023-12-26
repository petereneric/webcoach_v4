import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {AnimationService} from "../../services/animation.service";

@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.sass']
})
export class ListInputComponent implements OnInit, AfterViewInit {

  @ViewChild('vInputContainer') vInputContainer!: ElementRef
  @ViewChild('vInput') vInput!: ElementRef
  @ViewChild('vClickScreen') vClickScreen!: ElementRef

  @Output() outputSubmit: EventEmitter<any> = new EventEmitter<any>()

  @Input('cHint') cHint: string = ''

  constructor(private renderer: Renderer2, private svAnimation: AnimationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.vInput.nativeElement.addEventListener("focus", () => {

      // setting the opacity to 0 and afterward to 1 is a trick needed for avoiding the keyboard pushing the input and messing up the screen therefore since
      // other elements are also pushed up by the keyboard
      this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 0)
      console.log("no opacity")
      setTimeout(() => {
        this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 1)
        console.log("opacity")

        //let position = window!.visualViewport!.height - this.vInputNoteContainer.nativeElement.offsetHeight
        //this.cTitle = "yeah2: " + window!.visualViewport!.offsetTop + "_" + window!.visualViewport!.height + "_" + position
        //this.renderer.setStyle(this.vInputNoteContainer.nativeElement, 'top', position + 'px')

        // 20 seconds are needed, 2 seconds are to less
      }, 200)


    })

    this.vInput.nativeElement.addEventListener("focusout", () => {
      // needs a delay so that when submit is clicked the function is called and not disabled by display none
      setTimeout(() => {
        this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'none')
        this.svAnimation.backgroundOpacityOut(this.vClickScreen, () => {
          this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
          console.log("display none and closeddd");
        })
      }, 5)

    })

    window?.visualViewport?.addEventListener('resize', () => {
      let position = window!.visualViewport!.height - this.vInputContainer.nativeElement.offsetHeight
      //this.renderer.setStyle(this.vInputNoteContainer.nativeElement, 'top', position + 'px')
      this.svAnimation.moveVertical(this.vInputContainer, position, 0.26, null, 'ease-out')
      setTimeout(() => {
      }, 5)
    })

    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
  }

  show(cInput = '') {
    // show input and keyboard


    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'block')
    this.svAnimation.backgroundOpacityIn(this.vClickScreen)



    this.vInput.nativeElement.value = cInput
    this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'flex')

    //this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 0)
    this.vInput.nativeElement.focus()
  }


  onSubmit() {
    if (this.vInput.nativeElement.value !== '') {
      console.log("teest")

      this.outputSubmit.emit(this.vInput.nativeElement.value)
      this.vInput.nativeElement.value = ''
      close()
      //this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'none')
    }
  }

  close() {
    console.log("Helelo close me")
    this.vInput.nativeElement.blur()


    this.svAnimation.backgroundOpacityOut(this.vClickScreen, () => {
      this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
      console.log("display none and closed");
    })
  }





}
