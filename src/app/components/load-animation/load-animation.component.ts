import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-load-animation',
  templateUrl: './load-animation.component.html',
  styleUrls: ['./load-animation.component.sass']
})
export class LoadAnimationComponent {

  @ViewChild('vBlock') vBlock!: ElementRef

  public setWidth(width) {
    setTimeout(() => {
      /*** width sets wrong value therefore not used ***/
      this.vBlock.nativeElement.style.width = width + 'px'
      console.log("width_______________", width)
    }, )
  }

  public setHeight(height) {
    setTimeout(() => {
      this.vBlock.nativeElement.style.height = height + 'px'
    }, )
  }

  public setMargin(value) {
    setTimeout(() => {
      this.vBlock.nativeElement.style.margin = value
    }, )

  }

  public setPadding(value) {
    setTimeout(() => {
      this.vBlock.nativeElement.style.padding = value
    }, )
  }
}
