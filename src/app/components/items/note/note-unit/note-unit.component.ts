import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from "../../../../interfaces/note";
import {DateTime} from "../../../../utils/date-time";

@Component({
  selector: 'app-note-unit',
  templateUrl: './note-unit.component.html',
  styleUrls: ['./note-unit.component.sass'],
  providers: [DateTime]
})
export class NoteUnitComponent {

  @Input('aNote') aNote: Note | null = null

  @Output() outputSettings: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputClick: EventEmitter<any> = new EventEmitter<any>()

  constructor(public uDateTime: DateTime) {
  }


  onSettings() {
    this.outputSettings.emit()
  }

  onClick() {
    this.outputClick.emit()
  }
}
