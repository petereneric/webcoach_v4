import {Component, OnInit} from '@angular/core';
import {DefaultDialog} from "../default/default.dialog";
import {NavItem} from "../../components/nav-item/nav-item.interface";
import {DialogButton} from "../components/dialog-buttons/dialog-button.interface";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.dialog.html',
  styleUrls: ['./settings.dialog.sass']
})
export class SettingsDialog extends DefaultDialog implements OnInit {

  protected lButtons: DialogButton[] = [
    {id: 0, cTitle: 'SCHLIESSEN', bEnabled: true},
    {id: 1, cTitle: 'SPEICHERN', bEnabled: false},
  ]

  protected lNavItems: NavItem[] = [
    {id: 0, cTitle: 'Allgemein', cIcon: null, cLink: null},
    {id: 1, cTitle: 'Kanal', cIcon: null, cLink: null}
  ]

  protected aNavItemSelected!: NavItem

  override ngOnInit(): void {
    this.dialog.updateSize('50%', '60%');

  }

  onClick_NavItem(aNavItem: NavItem) {
    console.log(aNavItem)
    this.aNavItemSelected = aNavItem
  }

  onClick_Button(aButton: DialogButton) {
    switch (aButton.id) {
      case 0:
        this.dialog.close()
        break;
    }
  }
}
