import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";

@Component({
  selector: 'app-webinar-coach',
  templateUrl: './webinar-coach.component.html',
  styleUrls: ['./webinar-coach.component.sass'],
})
export class WebinarCoachComponent  implements OnInit {

  @Input() oWebinar!: Webinar

  constructor() { }

  ngOnInit() {}

}
