import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
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
}
