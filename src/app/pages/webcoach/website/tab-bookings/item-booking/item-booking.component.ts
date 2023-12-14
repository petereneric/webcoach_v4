import {Component, Input, OnInit} from '@angular/core';
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-item-booking',
  templateUrl: './item-booking.component.html',
  styleUrls: ['./item-booking.component.sass']
})
export class ItemBookingComponent implements OnInit{

  @Input('kWebinarPlayer') kWebinarPlayer!: number

  // data
  aWebinarPlayer
  urlThumbnail

  constructor(public router: Router, private api: ConnApiService) {
  }

  ngOnInit(): void {
    // webinar-player
    console.log(this.kWebinarPlayer)
    console.log("hee")
    this.api.safeGet('webinar-player/' + this.kWebinarPlayer, aWebinarPlayer => {
      console.log("biii-2");
      console.log(aWebinarPlayer)
      this.aWebinarPlayer = aWebinarPlayer

      // image webinar
      const kWebinar = this.aWebinarPlayer.kWebinar
      this.api.getImage('webinar/thumbnail/' + kWebinar, urlThumbnail => {
        this.urlThumbnail = urlThumbnail
      })
    })
  }

}
