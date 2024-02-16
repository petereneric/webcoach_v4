import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

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
  @Input('cInput') cInput: string = ''

  @Output() outputChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  protected nInput: number = 0
  private isChanged: boolean = false
  private cInputInitial: string | null = null


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {


    if (this.nMax) {
      this.vTextarea.nativeElement.addEventListener('input', () => {
        this.nInput = this.vTextarea.nativeElement.value.length
      })
    }

    this.vTextarea.nativeElement.addEventListener('beforeinput', () => {
      if (!this.cInputInitial) this.cInputInitial = this.cInput
    })

    this.vTextarea.nativeElement.addEventListener('input', () => {
      if (this.cInput === this.cInputInitial) {
        if (this.isChanged) {
          this.isChanged = false
          this.outputChange.emit(this.isChanged)
        }
      } else {
        if (!this.isChanged) {
          this.isChanged = true
          this.outputChange.emit(this.isChanged)
        }
      }

    })
  }

  get nHeight() {
    if (this.nMax) {
      if (this.nMax < 500) return '6rem'
      if (this.nMax < 1000) return '7.5rem'
      if (this.nMax < 5000) return '10rem'
      return '15rem'
    }
    return '5rem'
  }

  get cValue() {
    return this.cInput
  }

  reset() {
    this.cInputInitial = null
    this.isChanged = false
  }


}
