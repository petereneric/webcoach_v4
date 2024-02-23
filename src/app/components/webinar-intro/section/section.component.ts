import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from "../../../interfaces/section";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.sass'],
})
export class SectionComponent  implements OnInit {

  // input
  @Input() oSection!: Section
  @Input() bExpand!: boolean

  // output
  @Output() eventUnit: EventEmitter<any> = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {
    if (this.oSection.nPosition === 0) {
      this.bExpand = true
    }
  }

  onUnit($event: any) {
    this.eventUnit.emit($event)
  }
}
