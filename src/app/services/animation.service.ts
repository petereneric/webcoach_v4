import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

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

  slideIn30(element) {
    this.renderer.setStyle(element.nativeElement, 'transition', 1 + 's')
    this.renderer.setStyle(element.nativeElement, 'top', window.innerHeight-element.nativeElement.offsetHeight + 'px')
    setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transition', '0s')
      },
      1 * 1000);
    /*
    this.renderer.removeClass(element.nativeElement, 'slide-in-30')
    this.renderer.addClass(element.nativeElement, 'slide-out-30')
    this.renderer.removeClass(element.nativeElement, 'a-slide-out-30')
    this.renderer.addClass(element.nativeElement, 'a-slide-in-30')

     */
  }

  slideOut30(element) {
    this.renderer.setStyle(element.nativeElement, 'transition', 1 + 's')
    this.renderer.setStyle(element.nativeElement, 'top', window.innerHeight + 'px')
    setTimeout(() => {
        this.renderer.setStyle(element.nativeElement, 'transition', '0s')
      },
      1 * 1000);

    /*
    this.renderer.removeClass(element.nativeElement, 'slide-out-30')
    this.renderer.addClass(element.nativeElement, 'slide-in-30')
    this.renderer.removeClass(element.nativeElement, 'a-slide-in-30')
    this.renderer.addClass(element.nativeElement, 'a-slide-out-30')

     */
  }
}
