import {Component, OnInit} from '@angular/core';
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Webinar} from "../../../../interfaces/webinar";

@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.component.html',
  styleUrls: ['./tab-home.component.sass']
})
export class TabHomeComponent implements OnInit {

  // data
  lWebinar: Webinar[] = []

  constructor(private api: ConnApiService) {
  }

  ngOnInit(): void {

    // get webinars
    this.api.get('webinar', lWebinars => {
      this.lWebinar = lWebinars
      console.log(this.lWebinar)
    })
  }

}
