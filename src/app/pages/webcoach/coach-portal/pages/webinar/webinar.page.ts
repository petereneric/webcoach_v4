import {Component, OnInit} from '@angular/core';
import {CoachPortalService} from "../../coach-portal.service";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../../../services/api/api.service";
import {Webinar} from "../../../../../interfaces/webinar";

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.page.html',
  styleUrl: './webinar.component.sass'
})
export class WebinarPage implements OnInit {

  constructor(private svApi: ApiService, private route: ActivatedRoute, private svCoachPortal: CoachPortalService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      if (!this.svCoachPortal.bsWebinar.value) {
        const kWebinar = params['id']

        this.svApi.safeGet('coach-portal/webinar/' + kWebinar, (aWebinar: Webinar) => {
          console.log(aWebinar)
          this.svCoachPortal.bsWebinar.next(aWebinar)
        })
      }
    })


  }

}
