import { Injectable } from '@angular/core';
import {ConnApiService} from "../conn-api/conn-api.service";
import {BehaviorSubject} from "rxjs";
import {Player} from "../../interfaces/player";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // BehaviourSubject
  bsUserData: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null)

  constructor(private api: ConnApiService) {
  }

  downloadUserData() {
    this.api.safeGet('player/user-data', (aUserData: Player) => {
      this.bsUserData.next(aUserData)
    })
  }

  isUser(kPlayer) {
    return this.bsUserData.value?.id === kPlayer
  }
}
