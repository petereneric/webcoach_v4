import {Component, Input, OnInit} from '@angular/core';
import {Webinar} from "../../interfaces/webinar";

@Component({
  selector: 'app-toolbar-webinar',
  templateUrl: './toolbar-webinar.component.html',
  styleUrls: ['./toolbar-webinar.component.scss'],
})
export class ToolbarWebinarComponent implements OnInit {

  @Input() oWebinar!: Webinar | null

  constructor() { }

  ngOnInit() {}

}
