import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../../services/api/api.service";
import {Communication} from "../../../../services/communication/communication.service";

@Component({
  selector: 'app-edit-webinar',
  templateUrl: './edit-webinar.page.html',
  styleUrls: ['./edit-webinar.page.scss'],
})
export class EditWebinarPage implements OnInit {

  // data
  kWebinar!: number

  // menu
  lMenu = [{topic: 'Content erstellen', items: [{item: 'Kursplan', link: 'kursplan'}]}]

  constructor(private svCommunication: Communication, private connApi: ApiService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.kWebinar = params['id']

      this.connApi.safeGet('coach/webinar/'+this.kWebinar, (data: any) => {
        this.svCommunication.webinarEdit.next(data)
      })
    })
  }

}
