import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, UrlSegment} from "@angular/router";
import {map, Observable, Subscription} from "rxjs";
import {Webinar} from "../../../../../interfaces/webinar";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Section} from "../../../../../interfaces/section";
import {Communication} from "../../../../../services/communication/communication.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {

  // input
  @Input() lSections: Section[] | null = null
  @Input() bPadding: boolean = true

  // output
  @Output() eventUnit = new EventEmitter<any>()

  // data

  constructor(private svCommunication: Communication, private connApi: ConnApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

  }

  onEventUnit($event: any) {
    this.eventUnit.emit($event)
  }
}
