import {Component, Inject, Injector, INJECTOR, OnInit, ViewChild} from '@angular/core';
import {DefaultDialog} from "../../../../dialogs/default/default.dialog";
import {InputComponent} from "../../../../components/input/input.component";
import {File} from "../../../../../../../utils/file";
import {ApiService} from "../../../../../../../services/api/api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Unit} from "../../../../../../../interfaces/unit";
import {Section} from "../../../../../../../interfaces/section";
import {UnitMaterial} from "../../../../../../../interfaces/unit-material";
import {DialogButton} from "../../../../dialogs/components/dialog-buttons/dialog-button.interface";
import {DialogHeaderComponent} from "../../../../dialogs/components/dialog-header/dialog-header.component";
import {DialogNavComponent} from "../../../../dialogs/components/dialog-nav/dialog-nav.component";
import {DialogButtonsComponent} from "../../../../dialogs/components/dialog-buttons/dialog-buttons.component";

@Component({
  selector: 'app-section',
  templateUrl: './section.dialog.html',
  styleUrls: ['./section.dialog.sass'],
  standalone: true,
  imports: [InputComponent, DialogHeaderComponent, DialogNavComponent, DialogButtonsComponent],
})
export class SectionDialog extends DefaultDialog implements OnInit {

  @ViewChild('cpInputName') cpInputName!: InputComponent
  @ViewChild('cpInputDescription') cpInputDescription!: InputComponent

  protected nChangeCounter: number = 0

  constructor(@Inject(INJECTOR) injector: Injector, @Inject(MAT_DIALOG_DATA) protected aSection: Section) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.lNavItems = [
      {id: 0, cTitle: 'Allgemein', cIcon: null, cLink: null},
    ]

    this.lButtons = [
      {id: 0, cTitle: 'SCHLIESSEN', bEnabled: true},
    ]

    if (this.aSection.id > 0) {
      this.lButtons.push({id: 1, cTitle: 'SPEICHERN', bEnabled: false})
    } else {
      this.lButtons.push({id: 2, cTitle: 'HINZUFÜGEN', bEnabled: false})
    }
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
  }

  save() {
    // general
    console.log("jo")
    if (this.cpInputName.isChanged || this.cpInputDescription.isChanged) {
      const data = {
        kSection: this.aSection.id,
        cName: this.cpInputName.cValue,
        cDescription: this.cpInputDescription.cValue,
      }

      this.svApi.safePost('coach-portal/webinar/media/section/general', data, () => {
        this.aSection.cName = data.cName ?? ''
        this.aSection.cDescription = data.cDescription ?? ''
      })
    }
  }

  create() {
    if (this.cpInputName.isChanged || this.cpInputDescription.isChanged) {
      const data = {
        kWebinar: this.aSection.kWebinar,
        cName: this.cpInputName.cValue,
        cDescription: this.cpInputDescription.cValue,
        nPosition: this.aSection.nPosition
      }

      this.svApi.safePut('coach-portal/webinar/media/section', data, (aSection: Section) => {
        this.dialog.close(aSection);
      })
    }
  }

  override onClick_Button(aButton: DialogButton) {

    switch (aButton.id) {
      case 1:
        this.save()
        this.closeDialog()
        return;
      case 2:
        this.create()
        return;
    }
    super.onClick_Button(aButton)
  }

}
