import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-list-action-item',
  templateUrl: './list-action-item.component.html',
  styleUrls: ['./list-action-item.component.sass']
})
export class ListActionItemComponent {

  @Input('cName') cName: string = ""
  @Input('cIcon') cIcon: string = ""

}
