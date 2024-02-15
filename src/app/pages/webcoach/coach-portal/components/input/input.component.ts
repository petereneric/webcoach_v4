import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass']
})
export class InputComponent implements OnInit, AfterViewInit {

  @ViewChild('vTextarea') vTextarea!: ElementRef

  @Input('cTitle') cTitle: string = ''
  @Input('cHelp') cHelp: string | null = null
  @Input('nMax') nMax: number | null = null

  protected nInput: number = 0


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.nMax) {
      this.vTextarea.nativeElement.addEventListener('input', () => {
        this.nInput = this.vTextarea.nativeElement.value.length
      })
    }
  }



}
