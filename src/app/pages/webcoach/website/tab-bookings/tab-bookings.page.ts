import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../services/api/api.service";

@Component({
  selector: 'app-tab-bookings',
  templateUrl: './tab-bookings.page.html',
  styleUrls: ['./tab-bookings.page.sass']
})
export class TabBookingsPage implements OnInit {

  // data
  lWebinarPlayer = []

  constructor(private api: ApiService) {
  }


  ngOnInit(): void {
    console.log("jo")

    // list webinar-player

    this.api.safeGet('webinar-player', lWebinarPlayer => {
      this.lWebinarPlayer = lWebinarPlayer
      console.log("hiiiiiiiiiiiiiiii2")
      console.log(this.lWebinarPlayer)
    })
  }



}
