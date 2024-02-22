import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogButton} from "./dialog-button.interface";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dialog-buttons',
  templateUrl: './dialog-buttons.component.html',
  styleUrls: ['./dialog-buttons.component.sass'],
  standalone: true,
  imports: [CommonModule]
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
