import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.sass']
})
export class TitleComponent implements OnInit {

  // input
  @Input('cTitle') cTitle: string = ''
  @Input('bBack') bBack: boolean = false
  @Input('bBackDefault') bBackDefault: boolean = true

  //output
  @Output() outputBack: EventEmitter<any> = new EventEmitter<any>()

  constructor(private location: Location) {
  }

  ngOnInit(): void {
    console.log("joo")
  }


  onBack() {
    if (this.bBackDefault) this.location.back()
    this.outputBack?.emit()
  }
}
