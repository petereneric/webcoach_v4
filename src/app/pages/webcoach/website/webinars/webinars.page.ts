import { Component, OnInit } from '@angular/core';
import {Webinar} from "../../../../interfaces/webinar";
import {ApiService} from "../../../../services/api/api.service";

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.page.html',
  styleUrls: ['./webinars.page.sass'],
})
export class WebinarsPage implements OnInit {

  // data
  lWebinars: Webinar[] | null = null

  constructor(private connApi: ApiService) { }

  ngOnInit() {
    this.connApi.get('webinar', (data: Webinar[]) => {
      this.lWebinars = data
    })
  }

}
