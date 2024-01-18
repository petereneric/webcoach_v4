import {Injectable} from '@angular/core';
import {ApiService} from "../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class UnitRepository {

  constructor(private api: ApiService) {
  }

  safeGet_ProcessThumbnails(kUnit, callback) {
    this.api.safeGet('webinar/unit/process-thumbnails/' + kUnit, lProcessThumbnails => callback(lProcessThumbnails)
    )
  }
}
