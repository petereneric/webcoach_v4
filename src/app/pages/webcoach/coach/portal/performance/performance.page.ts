import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../../services/api/api.service";
import {Currency} from "../../../../../utils/currency";

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
  providers: [Currency]
})
export class PerformancePage implements OnInit {

  // data objects
  aPerformance

  constructor(private api: ApiService, public curreny: Currency) { }

  ngOnInit() {
    // get performance data
    this.api.safeGet('coach/performance', response => {
      this.aPerformance = response
      console.log(response)
    })
  }

}
