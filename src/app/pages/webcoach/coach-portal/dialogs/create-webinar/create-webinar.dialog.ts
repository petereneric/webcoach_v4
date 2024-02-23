import {Component, OnInit, ViewChild} from '@angular/core';
import {DefaultDialog} from "../default/default.dialog";
import {DialogButtonsComponent} from "../components/dialog-buttons/dialog-buttons.component";
import {DialogHeaderComponent} from "../components/dialog-header/dialog-header.component";
import {DialogNavComponent} from "../components/dialog-nav/dialog-nav.component";
import {InputComponent} from "../../components/input/input.component";
import {DialogButton} from "../components/dialog-buttons/dialog-button.interface";
import {MatDialogRef} from "@angular/material/dialog";
import {Webinar} from "../../../../../interfaces/webinar";

@Component({
  selector: 'app-create-webinar',
  standalone: true,
  imports: [
    DialogButtonsComponent,
    DialogHeaderComponent,
    DialogNavComponent,
    InputComponent
  ],
  templateUrl: './create-webinar.dialog.html',
  styleUrl: './create-webinar.dialog.sass'
})
export class CreateWebinarDialog extends DefaultDialog implements OnInit {

  @ViewChild('cpInputName') cpInputName!: InputComponent

  protected nChangeCounter: number = 0

  override ngOnInit(): void {
    super.ngOnInit()

    this.lButtons = [
      {id: 0, cTitle: 'ABBRECHEN', bEnabled: true},
      {id: 1, cTitle: 'HINZUFÜGEN', bEnabled: false},
    ]
  }

  override onClick_Button(aButton: DialogButton) {
    switch (aButton.id) {
      case 1:
        this.createWebinar()
        return
    }
    super.onClick_Button(aButton);
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

  createWebinar() {
    if (!this.validationCheck()) {
      this.svDialog.invalidInput()
      return
    }

    const data = {
      cName: this.cpInputName.cValue
    }
    this.svApi.safePut('coach-portal/webinar', data, (aWebinar: Webinar) => {
      this.dialog.close(aWebinar)
    })
  }

  validationCheck() {
    if (!this.cpInputName.isValid) return false
    return true
  }
}
