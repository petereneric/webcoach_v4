import {Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import {Communication} from "../../services/communication/communication.service";
import {RoleService} from "../../services/authentication/role.service";


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  @Output() menuEvent = new EventEmitter<string>();

  // variables
  bDesktop: boolean = false
  bSignedIn: boolean = false

  constructor(private svCommunication: Communication, public svRole: RoleService) { }

  ngOnInit() {
    this.setDesktop()

    this.svCommunication.token.subscribe((token) => {
      this.bSignedIn = token !== null
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setDesktop()
  }

  onMenu() {
    let eventTag = 'side-menu'
    this.menuEvent.emit(eventTag)
  }

  setDesktop() {
    this.bDesktop = window.innerWidth >= 1024
  }

}
