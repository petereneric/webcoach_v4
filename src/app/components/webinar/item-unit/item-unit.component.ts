import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Unit} from "../../../interfaces/unit";
import {DateTime} from "../../../utils/date-time";
import {Communication} from "../../../services/communication/communication.service";
import {EventUnit} from "../../../interfaces/events/eventUnit";
import {ApiService} from "../../../services/api/api.service";
import {UnitPlayer} from "../../../interfaces/unit-player";
import {File} from "../../../utils/file";
import {WebinarService} from "../../../services/data/webinar.service";

@Component({
  selector: 'app-item-unit',
  templateUrl: './item-unit.component.html',
  styleUrls: ['./item-unit.component.scss'],
  providers: [DateTime]
})
export class ItemUnitComponent implements OnInit, AfterViewInit {

  // viewChild
  @ViewChild('container') vContainer: ElementRef | null = null;

  // input
  @Input() oUnit: Unit | null = null
  @Input() aHeights: any

  // output
  @Output() eventUnit = new EventEmitter<any>()

  // variables
  currentUnit: Unit | null = null

  constructor(private svWebinar: WebinarService, private file: File, private changeDetector: ChangeDetectorRef, private connApi: ApiService, private svCommunication: Communication, public uDateTime: DateTime) {
  }

  ngOnInit() {
    // deactivated so that scrolling on mobile doesn't highlight item
    /*
    this.svCommunication.currentUnit.subscribe(unit => {
      this.currentUnit = unit
    })
     */

    this.svWebinar.bsUnit.subscribe(unit => {
      this.currentUnit = unit
    })
  }

  ngAfterViewInit(): void {
    this.aHeights.pxHeightUnit = this.vContainer?.nativeElement.offsetHeight
  }

  onSelect(oUnit: Unit | null) {
    let event = {
      cEvent: 'select',
      unit: oUnit,
      unitOld: this.svWebinar.bsUnit.value
    }
    this.eventUnit.emit(event)

    //this.svCommunication.currentUnit.next(oUnit)
  }

  onCheck() {
    let event = {
      cEvent: 'check',
      unit: this.oUnit,
    }
    this.eventUnit.emit(event)
  }

  updateUnitPlayer() {
    let unit: Unit | null = this.svCommunication.currentUnit.value
    if (unit?.oUnitPlayer !== null) {
      let dataUnitPlayer = {
        kUnit: unit?.id,
        tStatus: unit?.oUnitPlayer.tStatus,
        secVideo: unit?.oUnitPlayer.secVideo,
      }
      console.log(dataUnitPlayer)
      this.connApi.safePost('webinar/auth/unit-player', dataUnitPlayer, (data: any) => {
      })
    }
  }

  onMaterial(name: string) {
    this.connApi.safeGetFile('webinar/auth/unit/material/' + this.oUnit?.id + '/' + name, (blob: any) => {
      this.file.openBlob(blob)
    })
  }
}
