import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Communication} from "../../../../../services/communication/communication.service";
import {Webinar} from "../../../../../interfaces/webinar";
import {Section} from "../../../../../interfaces/section";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {File} from "../../../../../utils/file";
import {Toast} from "../../../../../utils/toast";
import {Unit} from "../../../../../interfaces/unit";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-units',
  templateUrl: './units.page.html',
  styleUrls: ['./units.page.scss'],
})
export class UnitsPage implements OnInit {

  oWebinar!: any

  // menu
  menuUnit = [{id: 0, cName: 'Video herunterladen'}]

  constructor(private uToast: Toast, private uFile: File, private connApi: ConnApiService, private svCommunication: Communication) { }

  ngOnInit() {
    this.svCommunication.webinarEdit.subscribe((webinar: Webinar | null) => {
      this.oWebinar = webinar
      console.log(this.oWebinar)
    })
  }

  onSaveSection(section: Section) {
    console.log(section)
    this.connApi.safePost('coach/section', section, null)
    section['bEdit'] = false
  }

  addUnit(section: Section) {
    let newUnit = {id: 0, cName: "", nComments: 0, nLikes: 0, lProcessThumbnails: [], lIntervals: [], lComments: [], kSection: section.id, secDuration: 0, oUnitPlayer: null, imgThumbnail: "", bMaterial: false, lMaterials: [], bVideo: false, nPosition: section.lUnits.length+1, bSample: 0}
    section.lUnits.push(newUnit)
  }

  onAddUnit(section: any, unit: any) {
    let data = {
      kSection: section['id'],
      cName: unit['cName'],
      nPosition: section.lUnits.length-1
    }
    this.connApi.safePut('coach/unit', data, (data: any) => {
      console.log(data)
      unit['id'] = data
    })
  }

  addSection() {
    console.log(this.oWebinar.lSections)
    let newSection = {id: 0, cName: "", nPosition: this.oWebinar.lSections.length, lUnits: [], bEdit: false}
    this.oWebinar.lSections.push(newSection)
  }

  onAddSection(section: any) {
    let data = {
      kWebinar: this.oWebinar['id'],
      cName: section['cName'],
      nPosition: this.oWebinar.lSections.length-1
    }
    this.connApi.safePut('coach/section', data, (data: any) => {
      console.log(data)
      section['id'] = data
    })
  }

  onDownloadVideo(unit: any) {
  }

  onAddVideo(files: any, unit: Unit) {
      this.uFile.getUrl(files[0]).then(data => {
        //console.log(data)

        let d = {
          kUnit: unit.id,
          base64Video: data
        }

        this.connApi.safeUpload('coach/unit/video', d).subscribe({next: (data: any) => {
              unit.bVideo = true
          this.uToast.uploadSuccessful()
          }, error: error => {
          console.log(error)
          }})
      })

  }

  onUpdateUnit(unit: any) {
    this.connApi.safePost('coach/unit', unit, (data: any) => {})
    unit['bEdit'] = false
  }

  dropUnit($event: CdkDragDrop<any, any>, lUnits: Unit[]) {
    let unit = lUnits[$event.previousIndex];
    lUnits.splice($event.previousIndex, 1);
    lUnits.splice($event.currentIndex, 0, unit);

    this.updateUnitPositions(lUnits)
  }

  updateUnitPositions(lUnits: Unit[]) {
    let data: any[] = []
    lUnits.forEach((unit, index) => {
      let object = {
        kUnit: unit.id,
        nPosition: index
      }
      data.push(object)
    })

    this.connApi.safePost('coach/unit/position', data, null)
  }

  dropSection($event: CdkDragDrop<any, any>, lSections: any) {
    let section = lSections[$event.previousIndex];
    lSections.splice($event.previousIndex, 1);
    lSections.splice($event.currentIndex, 0, section);

    this.updateSectionPositions(lSections)
  }

  updateSectionPositions(lSections: Section[]) {
    let data: any[] = []
    lSections.forEach((section, index) => {
      let object = {
        kSection: section.id,
        nPosition: index
      }
      data.push(object)
    })

    this.connApi.safePost('coach/section/position', data, null)
  }

  deleteUnit(kUnit: number, lUnits: Unit[], index: number) {
    this.connApi.safeDelete('coach/unit/' + kUnit, (response: any) => {
      lUnits.splice(index, 1);
    })
  }

  deleteSection(kSection: number, lSections: Section[], index: number) {
    this.connApi.safeDelete('coach/unit/' + kSection, (response: any) => {
      lSections.slice(index, 1)
    })
  }
}
