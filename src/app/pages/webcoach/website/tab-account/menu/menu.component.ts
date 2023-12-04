import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../../services/authentication/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  // menu
  lMenu =
    [
      {cName: 'Deine Daten', cPath: 'deine-daten'},
    ]

  constructor(public svAuth: AuthService, public router: Router) {
  }

  ngOnInit() {
  }

  onLogout() {
    localStorage.setItem('token', '')
  }
}
