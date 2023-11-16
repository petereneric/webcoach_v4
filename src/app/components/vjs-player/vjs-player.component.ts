import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as videojs from 'video.js'

@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('target', {static: true}) target: ElementRef | undefined = undefined

  // input
  @Input() options!: {
    fluid: boolean,
    fill: boolean,
    autoplay: boolean,
    controls: boolean,
    poster: string
  };

  // output
  @Output() videoEvent = new EventEmitter<string>()


  player!: videojs.default.Player;


  constructor() {
  }

  ngOnInit() {
    this.player = videojs.default(this.target?.nativeElement, this.options!, function () {})

    this.player.on('ended', data => {
      this.videoEvent.emit('ended')
    });

    this.player.volume(0);
  }


  ngAfterViewInit(): void {
    console.log("are going")
    //this.target!.nativeElement.style.height = "2000px"
    //this.target!.nativeElement.style.width = "100px"
  }

  ngOnDestroy(): void {

  }

  dispose() {
    this.player.dispose();
  }

  updateSource(source: string) {
    console.log(source)
    if (this.player !== undefined) {
      this.player.src({src: source, type: 'video/mp4'});
      this.player.poster('assets/logo/webcoach.webp')
      //this.player.options({"poster": "assets/image/eric_schumacher.jpg"})
      //this.player.load();
      //this.player.play();
    }
  }

  getTime() {
    if (this.player !== null) {
      return this.player.currentTime()
    } else {
      return 0
    }
  }

  setTime(seconds: number | null) {
    this.player.currentTime(seconds === null ? 0 : seconds)
  }

  moveVertical(yDelta: number) {
    this.target!.nativeElement.style.top = yDelta + 'px'
  }

  absolute() {
    this.target!.nativeElement.style.position = 'absolute'
    //this.target!.nativeElement.style.top = 0 + 'px'
    //this.target!.nativeElement.style.left = 0 + 'px'
    this.target!.nativeElement.style.offsetHeight = 0 + 'px'
  }

}
