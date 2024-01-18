import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CoachRepository {

  constructor(private api: ApiService) { }

  safeGet_Thumbnail(kCoach, callback) {
    this.api.safeDownloadImage('webinar/coach/thumbnail/' + kCoach, urlThumbnail => callback(urlThumbnail))
  }
}
