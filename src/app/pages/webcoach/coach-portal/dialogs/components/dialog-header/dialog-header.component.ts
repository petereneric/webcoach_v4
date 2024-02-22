import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.sass'],
  standalone: true,
})
export class DialogHeaderComponent {

  @Input('cTitle') cTitle: string = ''

}
