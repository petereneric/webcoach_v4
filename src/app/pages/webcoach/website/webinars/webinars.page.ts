import { Component, OnInit } from '@angular/core';
import {Webinar} from "../../../../interfaces/webinar";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.page.html',
  styleUrls: ['./webinars.page.scss'],
})
export class WebinarsPage implements OnInit {

  // data
  lWebinars: Webinar[] | null = null

  constructor(private connApi: ConnApiService) { }

  ngOnInit() {
    this.connApi.get('webinar', (data: Webinar[]) => {
      this.lWebinars = data
    })
  }

}
