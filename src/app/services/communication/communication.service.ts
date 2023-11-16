import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Unit} from "../../interfaces/unit";
import {Webinar} from "../../interfaces/webinar";

@Injectable({
  providedIn: 'root'
})

export class Communication {

  currentUnit: BehaviorSubject<Unit | null> = new BehaviorSubject<Unit | null>(null)

  webinarEdit: BehaviorSubject<Webinar | null> = new BehaviorSubject<Webinar | null>(null)

  token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor() { }
}
