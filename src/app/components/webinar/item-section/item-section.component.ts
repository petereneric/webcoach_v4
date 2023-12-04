import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
export class ItemSectionComponent implements OnInit, AfterViewInit {

  // view-childs
  @ViewChild('vSection') vSection!: ElementRef

  // input
  @Input() oSection: Section | null = null
  @Input() aHeights: any

  // output
  @Output() eventUnit = new EventEmitter<any>()

  // variables
  secSection: string = ''

  constructor(private svWebinar: WebinarService, private svCommunication: Communication, private uDateTime: DateTime) {
  }

  ngOnInit() {
    this.sumTime()

    // subscribe to unit
    this.svCommunication.currentUnit.subscribe(unit => {
      if (this.unitInSection(unit)) this.oSection!.bExpand = true
    })

    // subscribe to unit
    this.svWebinar.bsUnit.subscribe(aUnit => {
      this.oSection!.bExpand = this.unitInSection(aUnit)
    })
  }

  ngAfterViewInit(): void {
    this.aHeights.pxHeightSection = this.vSection.nativeElement.offsetHeight
    console.log(this.aHeights)
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
    this.oSection!.bExpand = !this.oSection!.bExpand
    if (!this.oSection!.bExpand) {
      let event = {
        cEvent: 'collapse',
        unit: null,
      }
      this.eventUnit.emit(event)
    }
  }


}
