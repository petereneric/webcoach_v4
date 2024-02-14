import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {UnitPlayer} from "../../interfaces/unit-player";

@Injectable({
  providedIn: 'root'
})
export class UnitPlayerRepository {

  constructor(private api: ApiService) { }

  safePost_UnitPlayer(data, callback: any = null) {
    this.api.safePost('webinar/auth/unit-player', data, () => {
      callback()
    })
  }
}
