import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Note} from "../../../interfaces/note";
import {DateTime} from "../../../utils/date-time";
import {Comment} from "../../../interfaces/comment";
import {CommentAnswer} from "../../../interfaces/comment-answer";
import {AnimationService} from "../../../services/animation.service";

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


  @Output() outputSettings: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputClick: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputLike: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputAnswer: EventEmitter<any> = new EventEmitter<any>()

  // variables
  cTimeAgo: any = ''

  constructor(private svAnimation: AnimationService, public uDateTime: DateTime) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.cTimeAgo = this.uDateTime.timeAgo(this.aComment?.dtCreation!)
  }

  onSettings() {
    this.outputSettings.emit()
  }

  onClick() {
    this.outputClick.emit()
  }


  onAnswers() {
    this.outputClick.emit()
  }

  onLike() {
    console.log(this.vLike)
    this.svAnimation.pump(this.vLike)
    this.outputLike.emit()
  }

  onAnswer() {
    this.outputAnswer.emit()
  }
}
