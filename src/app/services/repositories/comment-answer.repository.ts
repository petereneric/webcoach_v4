import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {CommentAnswer} from "../../interfaces/comment-answer";

@Injectable({
  providedIn: 'root'
})
export class CommentAnswerRepository {

  constructor(private api: ApiService) { }

  safeGet_CommentAnswers(kComment, callback) {
    this.api.safeGet('comment-answers/comment/' + kComment, (lCommentAnswers: CommentAnswer[]) => callback(lCommentAnswers))
  }
}
