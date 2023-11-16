import { Component, OnInit } from '@angular/core';
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Webinar} from "../../../../../interfaces/webinar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.page.html',
  styleUrls: ['./webinars.page.scss'],
})
export class WebinarsPage implements OnInit {

  // data
  lWebinars: Webinar[] = []

  // variables
  bAdd = false
  cWebinarAdd = ""

  constructor(private router: Router, private connApi: ConnApiService) { }

  ngOnInit() {
    this.connApi.safeGet('coach/webinars', (data: any) => {
      this.lWebinars = data
    })

  }

  onWebinar(id: any) {
    this.router.navigate(['/coach/kurs-bearbeiten/' + id])
  }

  onAddWebinar() {
    this.bAdd = true
  }

  onCreateWebinar() {
    let data = {
      cName: this.cWebinarAdd
    }

    this.connApi.safePut('coach/webinar', data, (kWebinar: number) => {
      this.router.navigate(['/coach/kurs-bearbeiten/' + kWebinar])
      this.bAdd = false
    })
  }
}
