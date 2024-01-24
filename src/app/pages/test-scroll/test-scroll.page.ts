import {Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-test-scroll',
  templateUrl: './test-scroll.page.html',
  styleUrls: ['./test-scroll.page.scss'],
})
export class TestScrollPage implements OnInit, OnDestroy {

  @ViewChild('test', { static: true }) vTest!: ElementRef
  @ViewChild('test_other', { static: true }) vTestOther!: ElementRef
  @ViewChild('number', { static: true }) vNumber!: ElementRef

  @HostBinding("piechart.--x")
  private value!: number;
  private angle = 0
  public seconds = 10

  condition = true
  process!: Subscription;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {

    this.vTest.nativeElement.style.setProperty('--x', '50%')
    //this.renderer.setStyle(this.vTest.nativeElement, 'background-image', 'conic-gradient(pink 135deg, transparent 0)')
    //this.renderer.setStyle(this.vTest.nativeElement, 'transition', 5 + 's')
    this.process = interval(1000).subscribe(val => {
      console.log(this.angle)
      if (this.seconds === 0) {
        this.process.unsubscribe()
      } else {
        this.seconds = this.seconds - 1
        let a = 360 - this.seconds * 36
        //this.renderer.setStyle(this.vTest.nativeElement, 'background-image', 'conic-gradient(pink ' + this.angle + 'deg, transparent 0)')
        this.renderer.setStyle(this.vTestOther.nativeElement, 'background', 'conic-gradient(white ' + a + 'deg, transparent ' + 0 + 'deg)')
        console.log("jo")
      }

    });
    //this.renderer.setStyle(this.vTest.nativeElement, 'background-image', 'conic-gradient(pink 180deg, transparent 0)')
    //this.vTest.nativeElement.style.backgroundImage = 'conic-gradient(pink 135deg, transparent 0);'
  }

  ngOnDestroy(): void {
    this.process.unsubscribe()
  }




}
