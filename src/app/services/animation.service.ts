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

  slideIn(element) {
    this.renderer.setStyle(element.nativeElement, 'transition', environment.TRANSITION_LIST_SWIPE + 's')
    this.renderer.setStyle(element.nativeElement, 'top', window.innerHeight-element.nativeElement.offsetHeight + 'px')
    setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transition', '0s')
      },
      environment.TRANSITION_LIST_SWIPE * 1000);
  }

  slideOut(element) {
    this.renderer.setStyle(element.nativeElement, 'transition', environment.TRANSITION_LIST_SWIPE + 's')
    this.renderer.setStyle(element.nativeElement, 'top', window.innerHeight + 'px')
    setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transition', '0s')
      },
      environment.TRANSITION_LIST_SWIPE * 1000);
  }

  show(elements: ElementRef[], secTimeout=0) {
    elements.forEach(element => {
      setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'opacity', 1)
      }, secTimeout * 1000)
    })
  }

  hide(elements: ElementRef[], secTimeout=0) {
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
}
