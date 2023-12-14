import { Injectable } from '@angular/core';
import {ConnApiService} from "../conn-api/conn-api.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // BehaviourSubject
  bsUserData: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private api: ConnApiService) {
  }

  downloadUserData() {
    this.api.safeGet('player/user-data', aUserData => {
      this.bsUserData.next(aUserData)
    })
  }
}
