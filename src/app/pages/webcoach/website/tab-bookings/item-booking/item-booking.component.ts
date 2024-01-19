import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ApiService} from "../../../../../services/api/api.service";
import {Router} from "@angular/router";
import {WebinarPlayer} from "../../../../../interfaces/webinar-player";
import {interval} from "rxjs";

@Component({
  selector: 'app-item-booking',
  templateUrl: './item-booking.component.html',
  styleUrls: ['./item-booking.component.sass']
})
export class ItemBookingComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('kWebinarPlayer') kWebinarPlayer!: number

  @ViewChild('block') block!: ElementRef
  @ViewChild('loader') loader!: ElementRef
  @ViewChild('vTitle') vTitle!: ElementRef
  @ViewChild('vProcess') vProcess!: ElementRef
  @ViewChild('vThumbnail') vThumbnail!: ElementRef

  // data
  aWebinarPlayer: WebinarPlayer | null = null
  urlThumbnail
  bLoading: boolean = false

  oLoadingProcess

  constructor(private renderer: Renderer2, public router: Router, private api: ApiService) {
  }


  ngOnInit(): void {
    // webinar-player




  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.kWebinarPlayer)
    console.log("hee")
    this.bLoading = true
    setTimeout(() => {

    }, 1000)

    this.api.safeGet('webinar-player/' + this.kWebinarPlayer, aWebinarPlayer => {
      console.log("biii-2");
      console.log(aWebinarPlayer)
      if (true) {

        this.aWebinarPlayer = aWebinarPlayer
        // image webinar
        const kWebinar = this.aWebinarPlayer!['kWebinar']
        this.api.getImage('webinar/thumbnail/' + kWebinar, urlThumbnail => {
          this.urlThumbnail = urlThumbnail
          setTimeout(() => {
            this.bLoading = false
          }, 30000)
        })


      }

    })
  }

}
