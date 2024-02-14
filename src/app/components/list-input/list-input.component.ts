import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {AnimationService} from "../../services/animation.service";

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
    let compStyles = window.getComputedStyle(this.vInputContainer.nativeElement);

    let paddingTopInputContainer = compStyles.getPropertyValue('padding-top');
    let paddingBottomInputContainer = compStyles.getPropertyValue('padding-bottom');

    let compStylesTwo = window.getComputedStyle(this.vInputWrapper.nativeElement);

    let paddingTopInputWrapper = compStylesTwo.getPropertyValue('padding-top');
    let paddingBottomInputWrapper = compStylesTwo.getPropertyValue('padding-bottom');

    let borderTopInputWrapper = compStylesTwo.getPropertyValue('border-width');

    this.borderPadding = Number(paddingTopInputContainer.replace('px', '')) + Number(paddingBottomInputContainer.replace('px', '')) + Number(paddingTopInputWrapper.replace('px', '')) + Number(paddingBottomInputWrapper.replace('px', '')) + Number(borderTopInputWrapper.replace('px', '')) * 2


    this.vInput.nativeElement.addEventListener("focus", () => {

      // setting the opacity to 0 and afterward to 1 is a trick needed for avoiding the keyboard pushing the input and messing up the screen therefore since
      // other elements are also pushed up by the keyboard
      this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 0)
      setTimeout(() => {
        this.renderer.setStyle(this.vInput.nativeElement, 'opacity', 1)
        // 20 seconds are needed, 2 seconds are to less
      }, 200)


      //this.updateHeights()
      //this.updateHeights()


      //this.renderer.setStyle(this.vInputContainer.nativeElement, 'height', this.vInput.nativeElement.scrollHeight + this.borderPadding + 'px')
      //this.renderer.setStyle(this.vInput.nativeElement, 'height', this.vInput.nativeElement.scrollHeight + 'px')
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
      const hInputContainer = this.vInputContainer.nativeElement.offsetHeight
      const hSpace = hInputContainer - this.borderPadding

      if (hSpace < 100) {
        this.updateHeights()
      } else {
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

    this.cRegard = cRegard
    if (cRegard !== null) {
      this.cHint = ''
    } else {
      if (cHint !== null) this.cHint = cHint
    }
    // show input and keyboard
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'display', 'block')
    this.svAnimation.backgroundOpacityIn(this.vClickScreen)

    this.vInput.nativeElement.value = cInput
    this.renderer.setStyle(this.vInputContainer.nativeElement, "display", 'flex')
    this.vInput.nativeElement.focus()

      let compStyles = window.getComputedStyle(this.vInputContainer.nativeElement);

      let hInputContainerMax = Number(compStyles.getPropertyValue('max-height').replace('px', ''));

      //const hInputContainerMax = this.vInputContainer.nativeElement.maxHeight
      const hSpace = hInputContainerMax - this.borderPadding
      console.log("hSpace", hSpace)
      console.log("hInputContainerMax", hInputContainerMax)

      if (hSpace < this.vInput.nativeElement.scrollHeight) {
        console.log("joooooooooo")
        this.renderer.setStyle(this.vInputContainer.nativeElement, 'height', hInputContainerMax + 'px')
        this.renderer.setStyle(this.vInput.nativeElement, 'height', hSpace + 'px')
      } else {
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

  onMove($event) {
    console.log("jo", $event.deltaY)
    this.svAnimation.moveVertical(this.vInput, $event.deltaY)
  }


}
