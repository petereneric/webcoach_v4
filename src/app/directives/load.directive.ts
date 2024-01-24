import {ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoadAnimationComponent} from "../components/load-animation/load-animation.component";

/***
 * Caller needs to handle the views (first) created with view-child and boolean
 * in ngOnit of Caller bLoad needs to be false so that views can render and get dimensions for mocking later with animation
 * in ngAfterViewInit bLoading can be set to true
 * text views needs a dummy text for filling out dimensions
 * in load-animation-component a timeout for setting the values is needed
 * images need a div around so that width setting works correctly
 */

@Directive({
  selector: '[ngLoad]',
  standalone: true,
})
export class LoadDirective {


  private isVisible: boolean | null = null;
  private height = 0
  private width = 0
  private margin = ""
  private padding = ""

  private context: any = {};

  constructor(private renderer: Renderer2, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
    this.context = {
      options: []
    }
  }

  @Input() set ngLoad(view: any) {
    if (view !== undefined) {
      let nativeElement = view.nativeElement
      this.height = nativeElement.offsetHeight
      this.width = nativeElement.offsetWidth
      this.margin = window.getComputedStyle(nativeElement).margin
      this.padding = window.getComputedStyle(nativeElement).padding
    }
  }

  @Input() set ngLoadStatus(bLoading: boolean) {
    if (bLoading) {
      if (this.isVisible === null || !this.isVisible) {
        this.viewContainer.clear()
        let cLoadingAnimation: ComponentRef<LoadAnimationComponent> = this.viewContainer.createComponent(LoadAnimationComponent)
        cLoadingAnimation.instance.setHeight(this.height)
        cLoadingAnimation.instance.setWidth(this.width)
        cLoadingAnimation.instance.setPadding(this.padding)
        cLoadingAnimation.instance.setMargin(this.margin)
        this.isVisible = true
      }
    } else {
      if (this.isVisible === null || this.isVisible) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
        this.isVisible = false
      }

    }
  }
}
