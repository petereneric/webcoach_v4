import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Unit} from "../../../interfaces/unit";

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.sass'],
})
export class UnitComponent  implements OnInit {

  // input
  @Input() oUnit!: Unit
  @Output() eventUnit: EventEmitter<any> = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {}

  onUnit() {
    const event = {
      aUnit: this.oUnit
    }
    this.eventUnit.emit(event)
  }
}
