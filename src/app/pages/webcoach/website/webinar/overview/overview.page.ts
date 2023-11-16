import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../../../../interfaces/webinar";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Section} from "../../../../../interfaces/section";
import {ActivatedRoute} from "@angular/router";
import {DateTime} from "../../../../../utils/date-time";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
  providers: [DateTime]
})
export class OverviewPage implements OnInit {

  // input
  @Input() oWebinar: Webinar | null = null
  @Input() lSections: Section[] | null = null

  // data
  cDuration: string = ''

  constructor(private uDateTime: DateTime, private route: ActivatedRoute, private connApi: ConnApiService) { }

  ngOnInit() {

    // set duration
    this.setDuration()

  }

  setDuration() {
    let secTotal = 0

    this.lSections?.forEach(section => {
      section.lUnits?.forEach(unit => {
        secTotal = secTotal + unit.secDuration
      })
    })

    this.cDuration = this.uDateTime.secondsToMinute(secTotal) + ' Min.'
  }

}
