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
  @ViewChild('vCoach') vCoach!: ElementRef
  @ViewChild('vThumbnail') vThumbnail!: ElementRef


  // data
  aWebinarPlayer: WebinarPlayer | null = null
  urlThumbnail
  bLoading: boolean = false

  constructor(private renderer: Renderer2, public router: Router, private api: ApiService) {
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.bLoading = true

    this.api.safeGet('webinar-player/' + this.kWebinarPlayer, aWebinarPlayer => {

      this.aWebinarPlayer = aWebinarPlayer
      // image webinar
      const kWebinar = this.aWebinarPlayer!['kWebinar']
      this.api.getImage('webinar/thumbnail/' + kWebinar, urlThumbnail => {
        this.urlThumbnail = urlThumbnail
        setTimeout(() => {
          this.bLoading = false
        }, 10000)
      })
    })
  }

}
