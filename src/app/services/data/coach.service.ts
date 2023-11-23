import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ConnApiService} from "../conn-api/conn-api.service";

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  // behavior-subjects
  bsThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private api: ConnApiService) { }

  loadThumbnail(kCoach: number) {
    this.api.safeDownloadImage('coach/thumbnail', (urlThumbnail: any) => {
      this.bsThumbnail.next(urlThumbnail)
    })
  }
}
