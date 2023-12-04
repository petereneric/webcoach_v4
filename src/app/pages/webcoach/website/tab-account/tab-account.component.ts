import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/authentication/auth.service";
import {Router, RouterOutlet} from "@angular/router";
import { routeTransitionAnimations } from './route-transition-animations';

@Component({
  selector: 'app-tab-account',
  templateUrl: './tab-account.component.html',
  styleUrls: ['./tab-account.component.sass'],
  animations: [routeTransitionAnimations]
})
export class TabAccountComponent implements OnInit {

  // menu
  lMenu =
    [
      {cName: 'Deine Daten', cPath: 'deine-daten'},
    ]

  constructor(public svAuth: AuthService, public router: Router) {
  }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }
}
