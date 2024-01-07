import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Note} from "../../../interfaces/note";
import {DateTime} from "../../../utils/date-time";
import {Comment} from "../../../interfaces/comment";
import {CommentAnswer} from "../../../interfaces/comment-answer";
import {AnimationService} from "../../../services/animation.service";
import {WebinarService} from "../../../services/data/webinar.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass'],
  providers: [DateTime]
})
export class CommentComponent implements OnInit, AfterViewInit {

  @ViewChild('vLike') vLike!: ElementRef

  @Input('aComment') aComment: Comment | null = null
  @Input('bIconAnswer') bIconAnswer: boolean = false
  @Input('bHighlight') bHighlight: boolean = false
  @Input('bShowAnswers') bShowAnswers: boolean = false
  @Input('bListen') bListen: boolean = false


  @Output() outputSettings: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputClick: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputLike: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputAnswer: EventEmitter<any> = new EventEmitter<any>()

  // variables
  cTimeAgo: any = ''

  constructor(private svWebinar: WebinarService, private svAnimation: AnimationService, public uDateTime: DateTime) {
  }

  ngOnInit(): void {
    if (this.bListen) {
      this.svWebinar.bsComment.subscribe((aComment) => {
        this.cTimeAgo = this.uDateTime.timeAgo(aComment?.dtCreation!)
      })
    }
  }

  ngAfterViewInit(): void {
    console.log("time", this.aComment?.dtCreation!)
    this.cTimeAgo = this.uDateTime.timeAgo(this.aComment?.dtCreation!)
    console.log(this.cTimeAgo)
  }

  onSettings(event) {
    event.stopPropagation();
    this.outputSettings.emit()
  }

  onClick() {
    this.outputClick.emit()
  }


  onAnswers(event) {
    //event.stopPropagation();
    //this.outputClick.emit()
  }

  onLike(event) {
    event.stopPropagation();
    console.log(this.vLike)
    this.svAnimation.pump(this.vLike)
    this.outputLike.emit()
  }

  onAnswer(event) {
    event.stopPropagation();
    this.outputAnswer.emit()
  }
}
