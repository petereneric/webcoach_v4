import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from "../../../interfaces/section";
import {DateTime} from "../../../utils/date-time";
import {EventUnit} from "../../../interfaces/events/eventUnit";
import {Communication} from "../../../services/communication/communication.service";
import {Unit} from "../../../interfaces/unit";
import {WebinarService} from "../../../services/data/webinar.service";

@Component({
  selector: 'app-item-section',
  templateUrl: './item-section.component.html',
  styleUrls: ['./item-section.component.scss'],
  providers: [DateTime]
})
export class ItemSectionComponent  implements OnInit {

  // input
  @Input() oSection: Section | null = null

  // output
  @Output() eventUnit = new EventEmitter<any>()

  // variables
  bExpand: boolean = false
  secSection: string = ''

  constructor(private svWebinar: WebinarService, private svCommunication: Communication, private uDateTime: DateTime) { }

  ngOnInit() {
    this.sumTime()

    // subscribe to unit
    this.svCommunication.currentUnit.subscribe(unit => {
      if (this.unitInSection(unit)) this.bExpand = true
    })

    // subscribe to unit
    this.svWebinar.bsUnit.subscribe(aUnit => {
      if (this.unitInSection(aUnit)) this.bExpand = true
    })


  }

  sumTime() {
    let sumSeconds: number = 0
    this.oSection?.lUnits.forEach(unit => {
      sumSeconds = sumSeconds + unit.secDuration
    })
    this.secSection = this.uDateTime.secondsToMinute(sumSeconds) + " Min."
  }


  onEventUnit($event: EventUnit) {
    this.eventUnit.emit($event)
  }

  unitInSection(unit: Unit | null) {
    let bExists = false
    this.oSection?.lUnits.forEach(u => {
      if (u.id === unit?.id) bExists = true
    })
    return bExists
  }

  onExpand() {
    this.bExpand = !this.bExpand
    if (!this.bExpand) {
      let event = {
        cEvent: 'collapse',
        unit: null,
      }
      this.eventUnit.emit(event)
    }
  }
}
