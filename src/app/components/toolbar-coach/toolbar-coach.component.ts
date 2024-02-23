import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar-coach',
  templateUrl: './toolbar-coach.component.html',
  styleUrls: ['./toolbar-coach.component.sass'],
})
export class ToolbarCoachComponent  implements OnInit {

  @Output() menuEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onMenu() {
    let eventTag = 'side-menu'
    this.menuEvent.emit(eventTag)
  }

}
