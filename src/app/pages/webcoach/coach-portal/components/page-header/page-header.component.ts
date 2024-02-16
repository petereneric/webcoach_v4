import {Component, ContentChild, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.sass']
})
export class PageHeaderComponent {

  @ContentChild('tpInteraction') tpInteraction!: TemplateRef<any>

  @Input('cTitle') cTitle!: string
  @Input('cWidth') cWidth: string | null = null

}
