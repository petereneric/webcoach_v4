import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ApiService} from "../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  // behavior-subjects
  bsThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private api: ApiService) { }

  loadThumbnail(kCoach: number) {
    this.api.safeDownloadImage('coach/thumbnail', (urlThumbnail: any) => {
      this.bsThumbnail.next(urlThumbnail)
    })
  }
}
