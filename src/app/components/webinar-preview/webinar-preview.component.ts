import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";
import {ApiService} from "../../services/api/api.service";
import {Numbers} from "../../utils/numbers";
import {Router} from "@angular/router";
import {Currency} from "../../utils/currency";

@Component({
  selector: 'app-webinar-preview',
  templateUrl: './webinar-preview.component.html',
  styleUrls: ['./webinar-preview.component.sass'],
})
export class WebinarPreviewComponent  implements OnInit {

  @Input() aWebinar: Webinar | null = null

  // data
  urlThumbnail: any | null= null

  constructor(public uCurrency: Currency, private router: Router, private connApi: ApiService) { }

  ngOnInit() {
    this.connApi.getImage('webinar/thumbnail/' +  this.aWebinar?.id, (urlCover: any) => {
      this.urlThumbnail = urlCover
    })
  }

  routeWebinar() {
    this.router.navigate([(this.aWebinar?.bVertical ? 'webinar-intro/' : 'webinar-intro/') + this.aWebinar?.id])
  }

}
