import {Component, Input, OnInit} from '@angular/core';
import {Unit} from "../../../interfaces/unit";

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent  implements OnInit {

  // input
  @Input() oUnit!: Unit

  constructor() { }

  ngOnInit() {}

}
