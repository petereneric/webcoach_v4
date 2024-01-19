import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-load-animation',
  templateUrl: './load-animation.component.html',
  styleUrls: ['./load-animation.component.sass']
})
export class LoadAnimationComponent {

  @ViewChild('block') block!: ElementRef

  public setHeight(height) {

    setTimeout(() => {
      console.log("TEEEEEEEEEEEEST")
      this.block.nativeElement.style.height = height + 'px'
    }, 10)

  }
}
