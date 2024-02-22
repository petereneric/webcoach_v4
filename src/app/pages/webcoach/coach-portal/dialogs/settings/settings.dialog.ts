import {Component, OnInit} from '@angular/core';
import {DefaultDialog} from "../default/default.dialog";
import {NavItem} from "../../components/nav-item/nav-item.interface";
import {DialogButton} from "../components/dialog-buttons/dialog-button.interface";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DialogHeaderComponent} from "../components/dialog-header/dialog-header.component";
import {DialogNavComponent} from "../components/dialog-nav/dialog-nav.component";
import {DialogButtonsComponent} from "../components/dialog-buttons/dialog-buttons.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.dialog.html',
  styleUrls: ['./settings.dialog.sass'],
  standalone: true,
  imports: [DialogHeaderComponent, DialogNavComponent, DialogButtonsComponent],
})
export class SettingsDialog extends DefaultDialog implements OnInit {

  override ngOnInit(): void {
    super.ngOnInit()

    this.lNavItems = [
      {id: 0, cTitle: 'Allgemein', cIcon: null, cLink: null},
      {id: 1, cTitle: 'Kanal', cIcon: null, cLink: null}
    ]

    this.lButtons = [
      {id: 0, cTitle: 'SCHLIESSEN', bEnabled: true},
      {id: 1, cTitle: 'SPEICHERN', bEnabled: false},
    ]
  }
}
