import {Component, OnInit} from '@angular/core';
//import {MenuController} from "@ionic/angular";
import {AuthApiService} from "../../../services/conn-api/auth-api.service";
import {Communication} from "../../../services/communication/communication.service";

@Component({
  selector: 'app-website',
  templateUrl: './website.page.html',
  styleUrls: ['./website.page.scss'],
})
export class WebsitePage implements OnInit {

  constructor(private authApi: AuthApiService, private svCommunication: Communication) {
  }

  ngOnInit() {

    // set token in communication service
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
        this.svCommunication.token.next(null)
    } else {
      this.authApi.authenticate().subscribe({
        next: (response: any) => {
          this.svCommunication.token.next(response.headers.get('authorization'))
        }, error: error => {
          console.log(error)
          this.svCommunication.token.next(null)
        }
      })
    }

  }


  menuEvent($event: string) {

  }
}
