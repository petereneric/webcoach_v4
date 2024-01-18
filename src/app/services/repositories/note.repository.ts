import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Note} from "../../interfaces/note";

@Injectable({
  providedIn: 'root'
})
export class NoteRepository {

  constructor(private api: ApiService) { }

  safeGet_Notes(kUnitPlayer, callback) {
    this.api.safeGet('notes/unit-player/'+kUnitPlayer, (lNotes: Note[]) => callback(lNotes))
  }
}
