import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Section} from "../../interfaces/section";

@Injectable({
  providedIn: 'root'
})
export class SectionRepository {

  constructor(private api: ApiService) { }

  safeGet_Sections(kWebinar, callback) {
    this.api.safeGet('webinar/auth/sections/' + kWebinar, (lSections: Section[]) => callback(lSections))
  }
}
