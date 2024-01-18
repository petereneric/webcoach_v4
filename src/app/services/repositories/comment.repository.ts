import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CommentRepository {

  constructor(private api: ApiService) { }

  safeGet_Comments(kUnit, callback) {
    this.api.safeGet('comments/unit/'+kUnit, (lComments: Comment[]) => callback(lComments))
  }
}
