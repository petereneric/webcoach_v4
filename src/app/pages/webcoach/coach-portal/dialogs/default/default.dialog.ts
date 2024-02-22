import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NavItem} from "../../components/nav-item/nav-item.interface";
import {DialogButton} from "../components/dialog-buttons/dialog-button.interface";
import {DialogHeaderComponent} from "../components/dialog-header/dialog-header.component";

@Component({
  selector: 'app-default',
  templateUrl: './default.dialog.html',
  styleUrls: ['./default.dialog.sass'],
  standalone: true,
  imports: []
})
export class DefaultDialog implements OnInit {

  protected lNavItems: NavItem[] = []
  protected lButtons: DialogButton[] = []

  protected aNavItemSelected!: NavItem

  constructor(public dialog: MatDialogRef<any>) {
  }

  ngOnInit(): void {
    this.dialog.updateSize('50%', '50%');
  }

  onClick_NavItem(aNavItem: NavItem) {
    console.log(aNavItem)
    this.aNavItemSelected = aNavItem
  }

  onClick_Button(aButton: DialogButton) {
    switch (aButton.id) {
      case 0:
        this.closeDialog()
        break;
    }
  }

  closeDialog() {
    this.dialog.close()
  }
}
