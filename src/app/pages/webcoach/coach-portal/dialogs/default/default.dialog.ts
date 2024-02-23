import {Component, Inject, INJECTOR, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NavItem} from "../../components/nav-item/nav-item.interface";
import {DialogButton} from "../components/dialog-buttons/dialog-button.interface";
import {DialogHeaderComponent} from "../components/dialog-header/dialog-header.component";
import {DialogService} from "../../../../../services/dialogs/dialog.service";
import {ApiService} from "../../../../../services/api/api.service";

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


  protected svDialog = this.injector.get(DialogService)
  protected svApi = this.injector.get(ApiService)
  protected dialog = this.injector.get(MatDialogRef<any>)

  constructor(@Inject(INJECTOR) protected injector: Injector) {
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
