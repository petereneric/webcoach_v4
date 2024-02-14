import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  popup(element) {
    //element.nativeElement.classList.remove("a-popup")

    this.renderer.removeClass(element.nativeElement, 'a-popup');
    element.nativeElement.offsetWidth;

    //
    setTimeout(() => {
        this.renderer.addClass(element.nativeElement, 'a-popup');
      },
      25);
  }

  iconClick(element) {
    this.renderer.removeClass(element.nativeElement, 'a-icon-click');

    //
    setTimeout(() => {
        this.renderer.addClass(element.nativeElement, 'a-icon-click');
      },
      50);
  }

  iconClickTwo(element) {
    let vAnimation: HTMLSpanElement | null = null

    for (let i = 0; i < element.nativeElement.children.length; i++) {
      if (element.nativeElement.children[i].id === 'vAnimation') {
        vAnimation = element.nativeElement.children[i]
        this.renderer.removeClass(vAnimation, 'a-icon-click')
      }
    }

    if (!vAnimation) {
      vAnimation = document.createElement("span");
      this.renderer.setStyle(vAnimation, 'position', 'absolute')
      const dimenReference = element.nativeElement.getBoundingClientRect()
      const diameter = Math.max(element.nativeElement.offsetWidth, element.nativeElement.offsetHeight) * 1.8;
      const radius = diameter / 2;
      this.renderer.setStyle(vAnimation, 'width', diameter + 'px')
      this.renderer.setStyle(vAnimation, 'height', diameter + 'px')
      this.renderer.setStyle(vAnimation, 'background', 'rgba(244,242,245,0.14)')
      this.renderer.setStyle(vAnimation, 'opacity', 0)
      this.renderer.setStyle(vAnimation, 'border-radius', '50%')
      this.renderer.setStyle(vAnimation, 'z-index', -1)
      this.renderer.setStyle(vAnimation, 'left', (dimenReference.x + (dimenReference.width/2) - radius) + 'px')
      this.renderer.setStyle(vAnimation, 'top', (dimenReference.y + (dimenReference.height/2) - radius) + 'px')
      this.renderer.setProperty(vAnimation, 'id', 'vAnimation')
      element.nativeElement.appendChild(vAnimation)
    }

    setTimeout(() => {
      this.renderer.addClass(vAnimation, 'a-icon-click');
    }, )
  }

  moveVertical(vElement, pxPosition, secTransition = 0, callback: any = null, speedCurve: string = '') {
    this.renderer.setStyle(vElement.nativeElement, 'transition', secTransition + 's' + ' ' + speedCurve)
    this.renderer.setStyle(vElement.nativeElement, 'top', pxPosition + 'px')
    setTimeout(() => {
        this.renderer.setStyle(vElement.nativeElement, 'transition', '0s')
        if (callback) callback()
      },
      secTransition * 1000);
  }

  // vertical
  slideIn(element, secTransition = environment.TRANSITION_LIST_SWIPE, callback: any = null) {
    this.moveVertical(element, window.innerHeight - element.nativeElement.offsetHeight, secTransition, callback)

    /*
    this.renderer.setStyle(element.nativeElement, 'transition', environment.TRANSITION_LIST_SWIPE + 's')
    this.renderer.setStyle(element.nativeElement, 'top', window.innerHeight - element.nativeElement.offsetHeight + 'px')
    setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transition', '0s')
      },
      environment.TRANSITION_LIST_SWIPE * 1000);
     */
  }

  // vertical
  slideOut(element, secTransition = environment.TRANSITION_LIST_SWIPE, callback: any = null) {
    this.moveVertical(element, window.innerHeight, secTransition, callback)
  }

  moveHorizontal(vElement, pxPosition, secTransition = 0, callback: any = null, speedCurve: string = '', fadingIn: boolean = false, fadingOut: boolean = false) {
    this.renderer.setStyle(vElement.nativeElement, 'transition', secTransition + 's' + ' ' + speedCurve)
    this.renderer.setStyle(vElement.nativeElement, 'left', pxPosition + 'px')
    setTimeout(() => {
        this.renderer.setStyle(vElement.nativeElement, 'transition', '0s')
        if (callback) callback()
      },
      secTransition * 1000);
    if (fadingIn) {
      this.renderer.removeClass(vElement.nativeElement, 'a-swing-out-opacity');
      this.renderer.removeClass(vElement.nativeElement, 'a-swing-in-opacity');
      setTimeout(() => {
        this.renderer.addClass(vElement.nativeElement, 'a-swing-in-opacity');
      }, 2)
    }
    if (fadingOut) {
      this.renderer.removeClass(vElement.nativeElement, 'a-swing-out-opacity');
      this.renderer.removeClass(vElement.nativeElement, 'a-swing-in-opacity');
      setTimeout(() => {
        this.renderer.addClass(vElement.nativeElement, 'a-swing-out-opacity');
      }, 2)
    }
  }

  // horizontal
  swingIn(element, secTransition = 0.5, callback: any = null) {
    this.moveHorizontal(element, 0, secTransition, callback, '', true)
  }

  swingOut(element, secTransition = 0.5, callback: any = null) {
    this.moveHorizontal(element, window.innerWidth, secTransition, callback, '', false, true)
  }

  show(elements: ElementRef[], secTimeout = 0) {
    elements.forEach(element => {
      setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'opacity', 1)
      }, secTimeout * 1000)
    })
  }

  hide(elements: ElementRef[], secTimeout = 0) {
    elements.forEach(element => {
      setTimeout(() => {
        console.log("heee")
        this.renderer.setStyle(element.nativeElement, 'opacity', 0)
      }, secTimeout * 1000)

    })
  }

  pump(element) {
    this.renderer.removeClass(element.nativeElement, 'a-pump');

    // timeout needed so that removeClass takes effect and can be added again for taking animation into action
    setTimeout(() => {
        this.renderer.addClass(element.nativeElement, 'a-pump');
      },
      2);
  }

  ripple(nativeElement, vContainer, evPointer: any) {
    const ripple = vContainer.getElementsByClassName("a-ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    const vRipple = document.createElement("span");
    this.renderer.setStyle(vRipple, 'position', 'absolute')

    this.renderer.removeClass(nativeElement, 'a-ripple')
    const diameter = Math.max(vContainer.offsetWidth, vContainer.offsetHeight);
    const radius = diameter / 2;
    this.renderer.setStyle(vRipple, 'width', diameter + 'px')
    this.renderer.setStyle(vRipple, 'height', diameter + 'px')
    this.renderer.setStyle(vRipple, 'left', (evPointer.layerX - radius) + 'px')
    this.renderer.setStyle(vRipple, 'top', (evPointer.layerY - radius) + 'px')
    console.log(vRipple)

    setTimeout(() => {
      this.renderer.addClass(vRipple, 'a-ripple')
      vContainer.appendChild(vRipple)
    }, 2)
  }

  backgroundOpacityIn(element) {
    this.renderer.removeClass(element.nativeElement, 'a-bg-opacity-out');
    this.renderer.removeClass(element.nativeElement, 'a-bg-opacity-in');
    setTimeout(() => {
      this.renderer.addClass(element.nativeElement, 'a-bg-opacity-in');
    }, 2)
  }

  backgroundOpacityOut(element, callback: any = null) {
    //this.renderer.removeClass(element.nativeElement, 'a-bg-opacity-in');
    setTimeout(() => {
      this.renderer.addClass(element.nativeElement, 'a-bg-opacity-out');
      setTimeout(() => {
        if (callback) callback()
      }, 0.25*1000 + 2)
    }, 2)

  }
}
