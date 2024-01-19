import {ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoadAnimationComponent} from "../components/load-animation/load-animation.component";

@Directive({
  selector: '[appLoad]',
  standalone: true,
})
export class LoadDirective implements OnInit{
  private isVisible: boolean | null = null;
  private height = 0
  private teeest = 0

  private context: any = {};

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
    this.context = {
      options: []
    }
  }

  @Input() set appLoad(condition: any) {
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHH___________________________")
    console.log(this.teeest)
    this.height = 1000
    if (condition !== undefined) {
      let nativeElement = condition.nativeElement
      if (nativeElement !== undefined) {
        console.log("____________________JA___________________")
        console.log(nativeElement.offsetHeight)
        this.height = nativeElement.offsetHeight
      } else {
        console.log("NEEEEEEEEEEEEEEEEE")
      }
    } else {
      console.log("HIER NICCCCCCHHHHHHHHHHHHHHHHHT")
    }


  }

  @Input() set appLoadStatus(condition: boolean) {
    this.teeest = 1
    if (condition) {
      if (this.isVisible === null || !this.isVisible) {

        console.log("heeeighttttttttttttttttttttttttttttt: ", this.height)

        this.viewContainer.clear()
        let factory = this.componentFactoryResolver.resolveComponentFactory(LoadAnimationComponent)
        console.log("hheeekjwlejkrkjwer")
        console.log("HEIG", this.height)
        console.log(factory)
        let result: ComponentRef<LoadAnimationComponent> = this.viewContainer.createComponent(factory)
        console.log(result.instance.setHeight(this.height))
        //console.log("height my friend", result.location.nativeElement.offsetHeight)
        //result.location.nativeElement.style.height = '30px'
        //this.renderer.setStyle(result.location.nativeElement, 'height', '5rem')
        this.isVisible = true
      }
    } else {
      if (this.isVisible === null || this.isVisible) {
        console.log("joooooooooooooooooooooooooPPPPPPPPPPPPPPPPPPPPPPPPPPo")
        console.log("heeeight: ", this.height)
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
        console.log("jo")
        console.log(this.templateRef.elementRef.nativeElement)
        this.isVisible = false
      }

    }
  }

  ngOnInit(): void {
  }



}
