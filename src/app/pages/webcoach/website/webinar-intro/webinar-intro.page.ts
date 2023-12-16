import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Webinar} from "../../../../interfaces/webinar";
import {Section} from "../../../../interfaces/section";
import {MatDialog} from "@angular/material/dialog";
import {DialogWebinarIntroComponent} from "../../../../dialogs/dialog-webinar-intro/dialog-webinar-intro.component";
import {Numbers} from "../../../../utils/numbers";
import {DateTime} from "../../../../utils/date-time";
import {Currency} from "../../../../utils/currency";
import {DomSanitizer} from "@angular/platform-browser";
import {CoachService} from "../../../../services/data/coach.service";
import {WebinarService} from "../../../../services/data/webinar.service";
import {Location} from "@angular/common";
import {VideoDialog} from "../../../../dialogs/video/video.dialog";

@Component({
  selector: 'app-webinar-intro',
  templateUrl: './webinar-intro.page.html',
  styleUrls: ['./webinar-intro.page.scss'],
})
export class WebinarIntroPage implements OnInit {

  // ViewChild
  @ViewChild('vCover') vCover!: ElementRef

  // variables
  urlCover: any
  bShowActionButton: boolean = false

  // data
  kWebinar: number | null = null
  oWebinar: Webinar | null = null
  aContent: any | null = null
  lSections: Section[] | null = null

  constructor(private renderer: Renderer2, private location: Location, public svWebinar: WebinarService, public sanitizer: DomSanitizer, public uDateTime: DateTime, public uCurrency: Currency, public uNumber: Numbers, private dialog: MatDialog, private router: Router, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.params?.subscribe(params => {
      this.kWebinar = params['id']

      // get image
      this.connApi.getImage('webinar/cover/' +  this.kWebinar, (urlCover: any) => {
        this.urlCover = urlCover
      })

      // get webinar
      this.connApi.get('webinar/' + this.kWebinar, (webinar: Webinar) => {
        console.log("webinar", webinar)
        this.oWebinar = webinar

        this.svWebinar.loadCoachThumbnail(this.oWebinar.oCoach.id)
      })

      // get sections
      this.connApi.get('webinar/sections-content/' + this.kWebinar, (aContent) => {
        this.aContent = aContent
      })
    })




  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    console.log($event);
    console.log(document.documentElement.scrollTop)
    this.bShowActionButton = document.documentElement.scrollTop > 500
  }

  onStart() {
    this.routeWebinar()
  }

  onPreview() {
    let dialogRef = this.dialog.open(DialogWebinarIntroComponent, {
      panelClass: 'dialog-container',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: {oWebinar: this.oWebinar},
    })

    dialogRef.afterClosed().subscribe(result => {
    })
  }

  routeWebinar() {
    this.router.navigate([(this.oWebinar?.bVertical ? 'webinar-vert/' : 'webinar/') + this.kWebinar])
  }

  onBack() {
    this.location.back();
  }

  onCover() {
    let dialogRef = this.dialog.open(VideoDialog, {
      panelClass: 'dialog-container',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: {urlVideo: 'webinar/trailer/' + this.oWebinar?.id},
    })

    dialogRef.afterClosed().subscribe(result => {
    })
  }

  onUnit($event: any) {
    const aUnit = $event.aUnit

    if (aUnit.bSample) {
      let dialogRef = this.dialog.open(VideoDialog, {
        panelClass: 'dialog-container',
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        data: {urlVideo: 'webinar/unit/video/' + aUnit.id},
      })

      dialogRef.afterClosed().subscribe(result => {
      })
    }

  }
}
