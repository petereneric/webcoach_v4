import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-test-scroll',
  templateUrl: './test-scroll.page.html',
  styleUrls: ['./test-scroll.page.scss'],
})
export class TestScrollPage implements OnInit {

  @ViewChild('cover') vCover!: ElementRef
  @ViewChild('vMain') vMain!: ElementRef
  @ViewChild('vMainTwo') vMainTwo!: ElementRef

  counterScroll = 0
  scrollCounter = 1

  lastKnownScrollPosition = 0;
   deltaY = 0;

  constructor() { }

  ngOnInit() {
    let lastKnownScrollPosition = 0;
    let deltaY = 0;

    document.getElementById("cover")!.addEventListener('scroll', function(e) {
      console.log("HE")
      let ticking = false;
      if (!ticking) {
        // event throtteling
        window.requestAnimationFrame(function() {
          deltaY = window.scrollY - lastKnownScrollPosition;
          lastKnownScrollPosition = window.scrollY;
          console.log('deltaY', deltaY);
          ticking = false;
        });
        ticking = true;
      }


    });
  }

  onMoveVideo($event) {
    console.log($event.deltaY)
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.counterScroll++
    console.log("HIIER")

    console.log(this.counterScroll)

  }

  @HostListener('window:mouseup', ['$event'])
  mouseUp(event){

  }

  @HostListener('document:touchmove', ['$event'])
  onMousemove(event: MouseEvent) {
      console.log("mouse move")
  }

  @HostListener('document:touchend', ['$event'])
  onMouseEnd(event: MouseEvent) {
    console.log("mouse end")
    console.log(this.counterScroll)
    this.change()
  }

  change() {
    if (this.counterScroll > 30) {
      console.log("YEEES")
      this.vMain.nativeElement.style.zIndex = 2000
      this.vMainTwo.nativeElement.style.zIndex = 2000
      //this.vCover.nativeElement.style.display = "none"
      //this.vCover.nativeElement.style.opacity = 0.01
      //this.vMain.nativeElement.style.top = 0 + 'px'
      //this.disableScroll()
      this.vMain.nativeElement.style.top = '0px'
      this.vMainTwo.nativeElement.style.top = '0px'
    }
  }

  click() {
    //window.scrollTo(0,-40*this.scrollCounter**2)
    //this.scrollCounter++
    console.log("Click")
    //this.vMain.nativeElement.style.top = 0 + 'px'
    this.counterScroll = 1000
  }

  onEnd($event) {
    console.log("joo");

  }

  preventDefault(e){
    e.preventDefault();
  }

  disableScroll(){
    document.body.addEventListener('touchmove', this.preventDefault, { passive: false });
  }

  onMove($event: import('hammerjs').HammerInput) {

  }
}
