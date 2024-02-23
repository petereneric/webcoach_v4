import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.sass'],
})
export class VerificationPage implements OnInit {

  constructor(private connApi: ApiService) { }

  ngOnInit() {
  }

  onMail() {
    let token = localStorage.getItem('token')

    this.connApi.get('registration/mail/verification/' + token, (data: any) => {

    })
  }
}
