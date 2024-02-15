import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {AnimationService} from "../../services/animation.service";
import {environment} from "../../../environments/environment";

/***
 * Explanation of textarea line grow: So that this works the height of the input is !!set to 0 before input and on show call!! and then on input based on scrollHeight.
 * The input container is also based on scrollHeight + the borderPadding (borderline and padding dynamically calculated in ngAfterViewInit and therefore not hardcoded).
 */

@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.sass']
})
export class ListInputComponent implements OnInit, AfterViewInit {

  @ViewChild('vInputContainer') vInputContainer!: ElementRef
  @ViewChild('vInputWrapper') vInputWrapper!: ElementRef
  @ViewChild('vInput') vInput!: ElementRef
  @ViewChild('vRegard') vRegard!: ElementRef
  @ViewChild('vClickScreen') vClickScreen!: ElementRef

  @Output() outputSubmit: EventEmitter<any> = new EventEmitter<any>()

  @Input('cHint') cHint: string = ''

  cRegard: string | null = null

  private borderPadding: number = 0


  constructor(private renderer: Renderer2, private svAnimation: AnimationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {


    this.vInput.nativeElement.addEventListener("focus", () => {

      // setting the opacity to 0 and afterward to 1 is a trick needed for avoiding the keyboard pushing the input and messing up the screen therefore since
      // other elements are also pushed up by the keyboard
      this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 0)
      setTimeout(() => {
        this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 1)
        // 20 seconds are needed, 2 seconds are to less
      }, 200)


    })

    this.vInput.nativeElement.addEventListener("focusout", () => {
      // needs a delay so that when submit is clicked the function is called and not disabled by display none
      setTimeout(() => {
        this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'none')
        this.svAnimation.backgroundOpacityOut(this.vClickScreen, () => {
          this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
        })
      }, 5)

    })

    this.vInput.nativeElement.addEventListener("beforeinput", () => {
      this.renderer.setStyle(this.vInput.nativeElement, 'height', 0 + 'px')
    })

    this.vInput.nativeElement.addEventListener("input", () => {
      // so that vInputContainer can shrink when needed
      this.renderer.setStyle(this.vInputContainer.nativeElement, 'height', this.vInput.nativeElement.scrollHeight + this.borderPadding + 'px')

      const hInputContainer = this.vInputContainer.nativeElement.offsetHeight
      const hSpace = hInputContainer - this.borderPadding

      console.log("hhII3", hSpace)
      if (hSpace < 160) {
        console.log("hhII")
        this.updateHeights()
        this.vInput.nativeElement.style.overflow = 'hidden'
      } else {
        console.log("hhII2")
        this.vInput.nativeElement.style.overflow = 'scroll'
        this.renderer.setStyle(this.vInput.nativeElement, 'height', hSpace + 'px')
      }

      this.updatePosition()
    })

    window?.visualViewport?.addEventListener('resize', () => {
      this.updatePosition(0.26)
    })


    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'none')
  }

  updateHeights() {
    this.renderer.setStyle(this.vInput.nativeElement, 'height', this.vInput.nativeElement.scrollHeight + 'px')
    this.renderer.setStyle(this.vInputContainer.nativeElement, 'height', this.vInput.nativeElement.scrollHeight + this.borderPadding + 'px')
  }

  updatePosition(secTransition = 0) {
    let position = window!.visualViewport!.height - this.vInputContainer.nativeElement.offsetHeight
    this.svAnimation.moveVertical(this.vInputContainer, position, secTransition, null, 'ease-out')
  }

  show(cInput = '', cRegard: string | null = null, cHint: string | null = null) {
    this.renderer.setStyle(this.vInput.nativeElement, 'height', 0 + 'px')

    this.cRegard = cRegard ? cRegard : ''
    if (cRegard !== null) {
      this.renderer.setStyle(this.vRegard.nativeElement, 'visibility', 'visible')

      this.cHint = ''
    } else {

      this.renderer.setStyle(this.vRegard.nativeElement, 'visibility', 'hidden')
      if (cHint !== null) this.cHint = cHint
    }
    // show input and keyboard
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'block')
    this.svAnimation.backgroundOpacityIn(this.vClickScreen)

    this.vInput.nativeElement.value = cInput
    this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'flex')
    this.vInput.nativeElement.focus()

    if (cRegard !== null) {
      console.log("hiiier", this.vRegard.nativeElement.getBoundingClientRect().height)
      this.setBorderPadding(this.vRegard.nativeElement.getBoundingClientRect().height)
    } else {
      this.setBorderPadding()
    }

    let compStyles = window.getComputedStyle(this.vInputContainer.nativeElement);

    let hInputContainerMax = Number(compStyles.getPropertyValue('max-height').replace('px', ''));

    //this.borderPadding = this.borderPadding + this.vRegard.nativeElement.offsetHeight
    console.log("vRegard", this.vRegard.nativeElement.getBoundingClientRect().height)
    console.log("heoooo", this.borderPadding)

    //const hInputContainerMax = this.vInputContainer.nativeElement.maxHeight
    const hSpace = hInputContainerMax - this.borderPadding
    console.log("hSpace", hSpace)
    console.log("hInputContainerMax", hInputContainerMax)

    if (hSpace < this.vInput.nativeElement.scrollHeight) {
      console.log("joooooooooo")
      this.vInput.nativeElement.style.overflow = 'scroll'
      this.renderer.setStyle(this.vInputContainer.nativeElement, 'height', hInputContainerMax + 'px')
      this.renderer.setStyle(this.vInput.nativeElement, 'height', hSpace + 'px')
    } else {
      this.vInput.nativeElement.style.overflow = 'hidden'
      console.log("nOOOOOOOOOOOOOOO")
      this.updateHeights()
    }

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

  setBorderPadding(extraValue = 0) {
    // extra value comes by regard

    let compStyles = window.getComputedStyle(this.vInputContainer.nativeElement);

    let paddingTopInputContainer = compStyles.getPropertyValue('padding-top');
    let paddingBottomInputContainer = compStyles.getPropertyValue('padding-bottom');

    let compStylesTwo = window.getComputedStyle(this.vInputWrapper.nativeElement);

    let paddingTopInputWrapper = compStylesTwo.getPropertyValue('padding-top');
    let paddingBottomInputWrapper = compStylesTwo.getPropertyValue('padding-bottom');

    let borderTopInputWrapper = compStylesTwo.getPropertyValue('border-width');

    this.borderPadding = Number(paddingTopInputContainer.replace('px', '')) + Number(paddingBottomInputContainer.replace('px', '')) + Number(paddingTopInputWrapper.replace('px', '')) + Number(paddingBottomInputWrapper.replace('px', '')) + Number(borderTopInputWrapper.replace('px', '')) * 2 + extraValue

    this.renderer.setStyle(this.vInput.nativeElement, 'margin-top', extraValue + 'px')
    console.log("borderPadding", this.borderPadding)
  }



}
