import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Webinar} from "../../interfaces/webinar";
import {Unit} from "../../interfaces/unit";
import {ApiService} from "../../services/api/api.service";
import {VjsPlayerComponent} from "../../components/vjs-player/vjs-player.component";

@Component({
  selector: 'app-dialog-webinar-intro',
  templateUrl: './dialog-webinar-intro.component.html',
  styleUrls: ['./dialog-webinar-intro.component.scss'],
})
export class DialogWebinarIntroComponent  implements OnInit {

  // view-child
  @ViewChild(VjsPlayerComponent, {static: true}) vjsPlayer!: VjsPlayerComponent;

  // variables
  kUnitSelect: number | null = null

  // data
  oWebinar: Webinar | null = null
  lUnits: Unit[] | null = null

  constructor(private connApi: ApiService, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.oWebinar = this.data.oWebinar

    this.connApi.get('webinar/unit/samples/' + this.oWebinar?.id, (data: any) => {
      this.lUnits = data
      this.selectUnit(this.lUnits![0])

      this.lUnits?.forEach(unit => {
        console.log(unit.id)
        this.connApi.getImage('webinar/unit/samples/thumbnail/' +  unit.id, (imgThumbnail: any) => {

          unit.imgThumbnail = imgThumbnail
        })
      })
    })
  }

  onClose() {
    this.dialogRef.close();
  }

  onVideoEvent($event: any) {

  }

  selectUnit(unit: Unit | null) {
    this.kUnitSelect = unit!.id
    this.setSource(unit)
  }

  setSource(unit: Unit | null) {
    this.vjsPlayer?.updateSource(this.connApi.getUrl('webinar/unit/video/' + unit?.id))
  }




}
