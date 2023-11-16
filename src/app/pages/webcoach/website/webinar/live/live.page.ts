import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../../../../interfaces/webinar";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Live} from "../../../../../interfaces/live";
import {DateTime} from "../../../../../utils/date-time";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-live',
  templateUrl: './live.page.html',
  styleUrls: ['./live.page.scss'],
  providers: [DateTime]
})
export class LivePage implements OnInit {

  @Input() oWebinar: Webinar | null = null

  // data
  oLive: Live | null = null

  constructor(private route: ActivatedRoute, public uDateTime: DateTime, private connApi: ConnApiService) {
  }

  ngOnInit() {

    // get live
    this.connApi.get('webinar/live/next/' + this.oWebinar?.id, (data: Live) => {
      this.oLive = data
    })
  }

}
