import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../../../../services/api/api.service";
import {Router} from "@angular/router";
import {WebinarPlayer} from "../../../../../interfaces/webinar-player";
import {interval} from "rxjs";

@Component({
  selector: 'app-item-booking',
  templateUrl: './item-booking.component.html',
  styleUrls: ['./item-booking.component.sass']
})
export class ItemBookingComponent implements OnInit, OnDestroy {

  @Input('kWebinarPlayer') kWebinarPlayer!: number

  // data
  aWebinarPlayer: WebinarPlayer | null = null
  urlThumbnail

  oLoadingProcess

  constructor(public router: Router, private api: ApiService) {
  }



  ngOnInit(): void {
    // webinar-player
    console.log(this.kWebinarPlayer)
    console.log("hee")
    this.startLoading()
    this.api.safeGet('webinar-player/' + this.kWebinarPlayer, aWebinarPlayer => {
      console.log("biii-2");
      console.log(aWebinarPlayer)
      if (false) {
        this.aWebinarPlayer = aWebinarPlayer

        // image webinar
        const kWebinar = this.aWebinarPlayer!['kWebinar']
        this.api.getImage('webinar/thumbnail/' + kWebinar, urlThumbnail => {
          this.urlThumbnail = urlThumbnail
        })
        this.stopLoading()
      }

    })
  }

  ngOnDestroy(): void {
    this.stopLoading()
  }


  startLoading() {
    this.oLoadingProcess = interval(100).subscribe(val => {

  })
  }

  stopLoading() {
    this.oLoadingProcess.unsubscribe()
  }

}
