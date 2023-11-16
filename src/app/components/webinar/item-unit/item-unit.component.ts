import {
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
import {ConnApiService} from "../../../services/conn-api/conn-api.service";
import {UnitPlayer} from "../../../interfaces/unit-player";
import {File} from "../../../utils/file";
import {WebinarService} from "../../../services/data/webinar.service";

@Component({
  selector: 'app-item-unit',
  templateUrl: './item-unit.component.html',
  styleUrls: ['./item-unit.component.scss'],
  providers: [DateTime]
})
export class ItemUnitComponent implements OnInit {

  // viewChild
  @ViewChild('container') vContainer: ElementRef | null = null;

  // input
  @Input() oUnit: Unit | null = null

  // output
  @Output() eventUnit = new EventEmitter<any>()

  // variables
  currentUnit: Unit | null = null

  constructor(private svWebinar: WebinarService, private file: File, private changeDetector: ChangeDetectorRef, private connApi: ConnApiService, private svCommunication: Communication, public uDateTime: DateTime) {
  }

  ngOnInit() {
    this.svCommunication.currentUnit.subscribe(unit => {
      this.currentUnit = unit
      console.log(unit)
    })

    this.svWebinar.bsUnit.subscribe(unit => {
      this.currentUnit = unit
    })

  }

  onSelect(oUnit: Unit | null) {
    let event = {
      cEvent: 'select',
      unit: oUnit,
      unitOld: this.svCommunication.currentUnit.value
    }
    this.eventUnit.emit(event)

    this.svCommunication.currentUnit.next(oUnit)
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
