import {Component, Inject, Injector, INJECTOR, OnInit, ViewChild} from '@angular/core';
import {DefaultDialog} from "../../../../dialogs/default/default.dialog";
import {NavItem} from "../../../../components/nav-item/nav-item.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Unit} from "../../../../../../../interfaces/unit";
import {InputComponent} from "../../../../components/input/input.component";
import {ApiService} from "../../../../../../../services/api/api.service";
import {DialogButton} from "../../../../dialogs/components/dialog-buttons/dialog-button.interface";
import {coerceStringArray} from "@angular/cdk/coercion";
import {File} from "../../../../../../../utils/file";
import {UnitMaterial} from "../../../../../../../interfaces/unit-material";
import {MatTooltipModule} from '@angular/material/tooltip';
import {PageHeaderModule} from "../../../../components/page-header/page-header.module";
import {DialogHeaderComponent} from "../../../../dialogs/components/dialog-header/dialog-header.component";
import {DialogNavComponent} from "../../../../dialogs/components/dialog-nav/dialog-nav.component";
import {DialogButtonsComponent} from "../../../../dialogs/components/dialog-buttons/dialog-buttons.component";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {ContentModule} from "../content.module";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-unit',
  templateUrl: './unit.dialog.html',
  styleUrls: ['./unit.dialog.sass'],
  providers: [File],
  standalone: true,
  imports: [InputComponent, MatTooltipModule, DialogHeaderComponent, DialogNavComponent, DialogButtonsComponent, MatIconModule, CommonModule],
})
export class UnitDialog extends DefaultDialog implements OnInit {

  @ViewChild('cpInputName') cpInputName!: InputComponent
  @ViewChild('cpInputDescription') cpInputDescription!: InputComponent

  protected nChangeCounter: number = 0
  protected lUnitMaterials: UnitMaterial[] = []
  protected hasContent: boolean | null = null

  constructor(@Inject(INJECTOR) injector: Injector, private uFile: File, @Inject(MAT_DIALOG_DATA) protected aUnit: Unit) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.lNavItems = [
      {id: 0, cTitle: 'Allgemein', cIcon: null, cLink: null},
      {id: 1, cTitle: 'Inhalt', cIcon: null, cLink: null},
      {id: 2, cTitle: 'Materialien', cIcon: null, cLink: null},
      {id: 3, cTitle: 'Einstellungen', cIcon: null, cLink: null},
    ]

    this.lButtons = [
      {id: 0, cTitle: 'SCHLIESSEN', bEnabled: true},

    ]

    if (this.aUnit.id > 0) {
      this.lButtons.push({id: 1, cTitle: 'SPEICHERN', bEnabled: false})
    } else {
      this.lButtons.push({id: 2, cTitle: 'HINZUFÜGEN', bEnabled: false})
    }

    this.svApi.safeGet('coach-portal/webinar/media/unit/material/' + this.aUnit.id, (lUnitMaterials: UnitMaterial[]) => {
      this.lUnitMaterials = lUnitMaterials
    })

    this.svApi.safeGet('coach-portal/webinar/media/unit/content/has-content/' + this.aUnit.id, (response: any) => {
      this.hasContent = response.hasContent
    })
  }

  onInput($event: boolean) {
    if ($event) {
      this.nChangeCounter++
    } else {
      this.nChangeCounter > 0 && this.nChangeCounter--
    }

    this.onChange()
  }

  onChange() {
    this.lButtons[1].bEnabled = this.nChangeCounter > 0
    this.lButtons[2].bEnabled = this.nChangeCounter > 0
  }

  save() {
    // general
    if (this.cpInputName.isChanged || this.cpInputDescription.isChanged) {
      const data = {
        kUnit: this.aUnit.id,
        cName: this.cpInputName.cValue,
        cDescription: this.cpInputDescription.cValue,
      }

      this.svApi.safePost('coach-portal/webinar/media/unit/general', data, () => {
        this.aUnit.cName = data.cName ?? ''
        this.aUnit.cDescription = data.cDescription
      })
    }
  }

  create() {
    if (this.cpInputName.isChanged || this.cpInputDescription.isChanged) {
      const data = {
        kSection: this.aUnit.kSection,
        cName: this.cpInputName.cValue,
        cDescription: this.cpInputDescription.cValue,
        nPosition: this.aUnit.nPosition
      }

      this.svApi.safePut('coach-portal/webinar/media/unit', data, (aUnit: Unit) => {
        this.dialog.close(aUnit);
      })
    }
  }

  override onClick_Button(aButton: DialogButton) {

    switch (aButton.id) {
      case 1:
        this.save()
        return;
      case 2:
        this.create()
        return;
    }
    super.onClick_Button(aButton)
  }

  reset() {
    this.cpInputName.reset()
    this.cpInputDescription.reset()
    this.nChangeCounter = 0
  }

  onClick_AddMaterial(files: any) {
    console.log(files[0])
    let file: any = files[0]
    this.uFile.getUrl(file).then(data => {
      if (data) {
        let aUnitMaterial: UnitMaterial = {
          id: 0,
          kUnit: this.aUnit.id,
          cName: file.name,
          dtCreation: "",
          cFileType: "pdf",
          base64Material: data
        }

        this.svApi.safeUpload('coach-portal/webinar/media/unit/material', aUnitMaterial).subscribe({next: (data: any) => {
            this.lUnitMaterials.push(aUnitMaterial)
          }, error: error => {
            console.log(error)
          }})
      }
    })

  }

  onClick_UnitMaterial(aUnitMaterial: UnitMaterial) {
    console.log(aUnitMaterial.id)
    console.log("jow")
    this.svApi.safeGetBase64('coach-portal/webinar/media/unit/material/file/' + aUnitMaterial.id, (data: any) => {
      console.log(data)
      this.uFile.openUrl(data)
      //this.uFile.openBlob(blob.base64Material)
    })
  }

  onClick_DeleteMaterial(aUnitMaterial: UnitMaterial, nIndex: number) {
    this.svApi.safeDelete('coach-portal/webinar/media/unit/material/' + aUnitMaterial.id, () => {
      this.lUnitMaterials.splice(nIndex, 1)
    })
  }

  onClick_DownloadVideo() {
    this.svApi.safeGetFile('coach-portal/webinar/media/unit/content/video/' + this.aUnit.id, (video: any) => {
      this.uFile.pushVideoToDownloadFolder(video, this.aUnit.cName)
    })
  }

  onClick_DeleteVideo() {
    this.svApi.safeDelete('coach-portal/webinar/media/unit/content/video/' + this.aUnit.id, () => {
      this.hasContent = false
    })
  }

  onClick_UploadVideo(files: any) {
    this.uFile.getUrlVideo(files[0]).then(data => {
      //console.log(data)
      if (data) {
        let d = {
          kUnit: this.aUnit.id,
          base64Video: data
        }

        this.svApi.safeUpload('coach-portal/webinar/media/unit/content/video', d).subscribe({next: (data: any) => {
            this.hasContent = true
          }, error: error => {
            console.log(error)
          }})
      }
    })
  }

  onClick_DeleteUnit() {
    this.svApi.safeDelete("coach-portal/webinar/media/unit/" + this.aUnit.id, () => {
      const aResponse = {
        tCode: "DELETE"
      }
      this.dialog.close(aResponse);
    })
  }
}
