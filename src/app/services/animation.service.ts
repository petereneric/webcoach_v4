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
      50);
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

  slideOut(element, secTransition = environment.TRANSITION_LIST_SWIPE, callback: any = null) {
    this.moveVertical(element, window.innerHeight, secTransition, callback)
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
