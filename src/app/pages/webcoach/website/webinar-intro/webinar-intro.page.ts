import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {Webinar} from "../../../../interfaces/webinar";
import {Section} from "../../../../interfaces/section";
import {MatDialog} from "@angular/material/dialog";
import {DialogWebinarIntroComponent} from "../../../../dialogs/dialog-webinar-intro/dialog-webinar-intro.component";
import {Numbers} from "../../../../utils/numbers";

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

  // data
  kWebinar: number | null = null
  oWebinar: Webinar | null = null
  lSections: Section[] | null = null

  constructor(public uNumber: Numbers, private dialog: MatDialog, private router: Router, private connApi: ConnApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // token

    this.activatedRoute.params?.subscribe(params => {
      this.kWebinar = params['id']

      // get image
      this.connApi.downloadImage('webinar/cover/' +  this.kWebinar, (urlCover: any) => {
        this.urlCover = urlCover
      })

      // get webinar
      this.connApi.get('webinar/' + this.kWebinar, (webinar: Webinar) => {
        console.log(webinar)
        this.oWebinar = webinar
      })

      // get sections
      this.connApi.get('webinar/sections/' + this.kWebinar, (sections: Section[]) => {
        this.lSections = sections
      })
    })


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
}
