import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";
import {ApiService} from "../../services/api/api.service";

@Component({
  selector: 'app-webinar-preview-small',
  templateUrl: './webinar-preview-small.component.html',
  styleUrls: ['./webinar-preview-small.component.sass'],
})
export class WebinarPreviewSmallComponent  implements OnInit {

  @Input() oWebinar: Webinar | null = null

  // data
  urlCover: any | null= null

  constructor(private connApi: ApiService) { }

  ngOnInit() {
    this.connApi.getImage('webinar/cover/' +  this.oWebinar?.id, (urlCover: any) => {
      this.urlCover = urlCover
    })
  }

}
