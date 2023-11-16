import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";
import {ConnApiService} from "../../services/conn-api/conn-api.service";
import {Numbers} from "../../utils/numbers";
import {Router} from "@angular/router";

@Component({
  selector: 'app-webinar-preview',
  templateUrl: './webinar-preview.component.html',
  styleUrls: ['./webinar-preview.component.scss'],
})
export class WebinarPreviewComponent  implements OnInit {

  @Input() oWebinar: Webinar | null = null

  // data
  urlCover: any | null= null

  constructor(private router: Router, public uNumbers: Numbers, private connApi: ConnApiService) { }

  ngOnInit() {
    this.connApi.downloadImage('webinar/cover/' +  this.oWebinar?.id, (urlCover: any) => {
      this.urlCover = urlCover
    })
  }

  routeWebinar() {
    this.router.navigate([(this.oWebinar?.bVertical ? 'webinar-intro/' : 'webinar-intro/') + this.oWebinar?.id])
  }

}
