import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.sass']
})
export class TitleComponent implements OnInit {

  // input
  @Input('cTitle') cTitle: string = ''
  @Input('bBack') bBack: boolean = false

  //output
  @Output() outputBack = new EventEmitter<any>()

  ngOnInit(): void {
    console.log("joo")
  }


  onBack() {
    this.outputBack.emit()
  }
}
