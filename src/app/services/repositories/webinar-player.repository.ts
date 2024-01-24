import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {UnitPlayer} from "../../interfaces/unit-player";

@Injectable({
  providedIn: 'root'
})
export class WebinarPlayerRepository {

  constructor(private api: ApiService) { }

  safeGet_WebinarPlayer(kWebinar, callback) {
    this.api.safeGet('webinar/auth/webinar-player/' + kWebinar, aWebinarPlayer => callback(aWebinarPlayer))
  }

  safePut_WebinarPlayer(kWebinar, callback) {
    this.api.safePut('webinar/auth/webinar-player/' + kWebinar, {},aWebinarPlayer => callback(aWebinarPlayer))
  }

  safePost_WebinarPlayer(data) {
    this.api.safePost('webinar/auth/webinar-player', data)
  }
}
