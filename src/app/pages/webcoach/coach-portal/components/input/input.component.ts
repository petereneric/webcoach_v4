import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AutosizeModule} from "ngx-autosize";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
  standalone: true,
  imports: [MatTooltipModule, MatIconModule, FormsModule, CommonModule, ReactiveFormsModule, AutosizeModule]
})
export class InputComponent implements OnInit, AfterViewInit {

  formControl = new FormControl('');

  @ViewChild('vTextarea') vTextarea!: ElementRef

  @Input('cTitle') cTitle: string = ''
  @Input('cHelp') cHelp: string | null = null

  @Input('cInput') set cInput(cInput: string) {
    this.nInput = cInput.length
    this.formControl.setValue(cInput)
  }

  @Input('nMax') nMax: number | null = null
  @Input('bRequired') bRequired: boolean = false

  @Output() outputChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  protected nInput: number = 0
  private bChanged: boolean = false
  protected cInputInitial: string | null = null


  ngOnInit(): void {
    console.log(this.nMax)
    const lValidators: ValidatorFn[] = []
    if (this.nMax) lValidators.push(Validators.maxLength(this.nMax))
    if (this.bRequired) lValidators.push(Validators.required)
    //lValidators.push(Validators.pattern('^[a-zA-Z0-9.,%()!?<>/-+]+$'))
    lValidators.push(Validators.pattern('^[a-zA-Z0-9.,%()/!?<>+:äöüÄÖÜß\\-\\s ]+$'))
    this.formControl.setValidators(lValidators)


  }

  ngAfterViewInit(): void {
    if (this.nMax) {
      this.vTextarea.nativeElement.addEventListener('input', () => {
        this.nInput = this.vTextarea.nativeElement.value.length
      })
    }

    this.vTextarea.nativeElement.addEventListener('beforeinput', () => {
      if (!this.cInputInitial) this.cInputInitial = this.formControl.value
    })

    this.vTextarea.nativeElement.addEventListener('input', () => {
      console.log(this.formControl.valid)
      if (this.formControl.value === this.cInputInitial) {
        if (this.bChanged) {
          this.bChanged = false
          this.outputChange.emit(this.bChanged)
        }
      } else {
        if (!this.bChanged) {
          this.bChanged = true
          this.outputChange.emit(this.bChanged)
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
    return this.formControl.value
  }

  get isChanged() {
    return this.bChanged
  }

  get isValid() {
    //console.log(this.formControl.errors)
    return !this.cInputInitial || this.formControl.valid
  }

  reset() {
    this.cInputInitial = null
    this.bChanged = false
  }


}
