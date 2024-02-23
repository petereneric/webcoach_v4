import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../../../services/api/api.service";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.sass'],
})
export class ConfirmationPage implements OnInit {

  constructor(private router: Router, private connApi: ApiService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['token'] != null) {
        this.verifyToken(params['token']);
      }
    });
  }

  verifyToken(token: string) {
    this.connApi.longGet('registration/verify/' + token).subscribe({ next: data => {
        console.log(data);
        localStorage.removeItem('token');
        this.router.navigate(['login/0'])
      }
      , error: error => {
        console.log(error);
        this.router.navigate(['registrierung/invalid']);
      }
    });
  }

}
