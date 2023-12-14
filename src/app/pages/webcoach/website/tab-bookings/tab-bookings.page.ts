import {Component, OnInit} from '@angular/core';
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";

@Component({
  selector: 'app-tab-bookings',
  templateUrl: './tab-bookings.page.html',
  styleUrls: ['./tab-bookings.page.sass']
})
export class TabBookingsPage implements OnInit {

  // data
  lWebinarPlayer = []

  constructor(private api: ConnApiService) {
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
