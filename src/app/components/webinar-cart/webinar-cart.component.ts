import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";
import {Currency} from "../../utils/currency";
import {Router} from "@angular/router";
import {ConnApiService} from "../../services/conn-api/conn-api.service";

@Component({
  selector: 'app-webinar-cart',
  templateUrl: './webinar-cart.component.html',
  styleUrls: ['./webinar-cart.component.sass']
})
export class WebinarCartComponent implements OnInit {

  @Input() aWebinar: Webinar | null = null
  @Input() kWebinar!: number

  // data
  urlThumbnail: any | null= null

  constructor(public uCurrency: Currency, private connApi: ConnApiService) {
  }

  ngOnInit(): void {
    console.log("jop")
    console.log(this.aWebinar?.id)
    this.connApi.getImage('webinar/thumbnail/' +  this.kWebinar, (urlCover: any) => {
      this.urlThumbnail = urlCover
    })
  }

}
