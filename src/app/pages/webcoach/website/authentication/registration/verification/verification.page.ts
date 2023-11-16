import { Component, OnInit } from '@angular/core';
import {ConnApiService} from "../../../../../../services/conn-api/conn-api.service";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  constructor(private connApi: ConnApiService) { }

  ngOnInit() {
  }

  onMail() {
    let token = localStorage.getItem('token')

    this.connApi.get('registration/mail/verification/' + token, (data: any) => {

    })
  }
}
