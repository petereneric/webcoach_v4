import { Component, OnInit } from '@angular/core';
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Webinar} from "../../../../interfaces/webinar";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // data
  lWebinars: Webinar[] | null = null

  constructor(private connApi: ConnApiService) { }

  ngOnInit() {
    this.connApi.get('webinar', (data: Webinar[]) => {
      this.lWebinars = data
    })
  }

}
