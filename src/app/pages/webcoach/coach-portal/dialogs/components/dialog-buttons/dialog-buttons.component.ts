import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogButton} from "./dialog-button.interface";

@Component({
  selector: 'app-dialog-buttons',
  templateUrl: './dialog-buttons.component.html',
  styleUrls: ['./dialog-buttons.component.sass']
})
export class DialogButtonsComponent implements OnInit {

  @Input('lButtons') lButtons: DialogButton[] = []

  @Output() outputClick: EventEmitter<DialogButton> = new EventEmitter<DialogButton>()

  ngOnInit() {

  }

  onClick(aButton: DialogButton) {
    this.outputClick.emit(aButton)
  }
}
