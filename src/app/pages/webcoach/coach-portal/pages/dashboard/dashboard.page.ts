import {Component, OnInit, ViewChild} from '@angular/core';
import {Tab} from "../../components/tabs/tab.interface";
import {ApiService} from "../../../../../services/api/api.service";
import {Webinar} from "../../../../../interfaces/webinar";
import {File} from "../../../../../utils/file";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.sass'],
  providers: [File]
})
export class DashboardPage implements OnInit {

  // data
  protected aWebinarLast: Webinar | null = null
  protected nRankingByCalls: number = 0
  protected lWebinarsOrderedByDate: Webinar[] = []
  protected lWebinarsOrderedByCalls: Webinar[] = []

  constructor(protected uFile: File, private svApi: ApiService, protected router: Router) {
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('token'))
    this.svApi.safeGet('coach-portal/dashboard', (data: any) => {
      console.log(data)
      this.aWebinarLast = data.aWebinarLast
      this.lWebinarsOrderedByDate = data.lWebinarsOrderedByDate
      this.lWebinarsOrderedByCalls = data.lWebinarsOrderedByCalls
      this.lWebinarsOrderedByCalls.forEach((aWebinar: Webinar, index) => {
        if (aWebinar.id === this.aWebinarLast?.id) {
          this.nRankingByCalls = index+1
        }
      })
    })
  }

}
