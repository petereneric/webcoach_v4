import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";
import {ConnApiService} from "../../services/conn-api/conn-api.service";

@Component({
  selector: 'app-webinar-preview-small',
  templateUrl: './webinar-preview-small.component.html',
  styleUrls: ['./webinar-preview-small.component.scss'],
})
export class WebinarPreviewSmallComponent  implements OnInit {

  @Input() oWebinar: Webinar | null = null

  // data
  urlCover: any | null= null

  constructor(private connApi: ConnApiService) { }

  ngOnInit() {
    this.connApi.downloadImage('webinar/cover/' +  this.oWebinar?.id, (urlCover: any) => {
      this.urlCover = urlCover
    })
  }

}
