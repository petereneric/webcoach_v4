import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Webinar} from "../../../interfaces/webinar";

@Injectable({
  providedIn: 'root'
})
export class CoachPortalService {

  public bsWebinar: BehaviorSubject<Webinar | null> = new BehaviorSubject<Webinar | null>(null)

  constructor() { }
}
