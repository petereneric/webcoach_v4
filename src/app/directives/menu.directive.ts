import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective {

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef,) { }

  @Input() set appMenu(condition: boolean) {
    this.viewContainer.createEmbeddedView(this.templateRef);

  }

}
