import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Webinar} from "../../interfaces/webinar";
import {B} from "@angular/cdk/keycodes";
import {ConnApiService} from "../conn-api/conn-api.service";
import {Section} from "../../interfaces/section";
import {Unit} from "../../interfaces/unit";

@Injectable({
  providedIn: 'root'
})
export class WebinarService {

  bsWebinar: BehaviorSubject<Webinar | null> = new BehaviorSubject<Webinar | null>(null)
  bsSections: BehaviorSubject<Section[] | null> = new BehaviorSubject<Section[] | null>(null)
  bsUnit: BehaviorSubject<Unit | null> = new BehaviorSubject<Unit | null>(null)

  constructor(private api: ConnApiService) {
    this.bsWebinar.subscribe((aWebinar) => {

    })
  }

  load(kWebinar: number) {
    this.loadWebinar(kWebinar)
  }

  loadWebinar(kWebinar: number) {
    this.api.get('webinar/' + kWebinar, (aWebinar: Webinar) => {
      this.bsWebinar.next(aWebinar)

      this.loadSections(kWebinar)
    })
  }

  loadSections(kWebinar: number) {
    this.api.safeGet('webinar/auth/sections/' + kWebinar, (lSections: Section[]) => {
      this.bsSections.next(lSections)

      this.loadUnit(kWebinar)
    })
  }

  loadUnit(kWebinar: number) {
    console.log(kWebinar)
    this.api.safeGet('webinar/auth/webinar-player/' + kWebinar, (aWebinarPlayer: any) => {
      // current unit
      let aUnit = aWebinarPlayer.aUnit;

      // current unit is null
      if (aUnit === null) {
        // select first unit as current unit
        aUnit = this.bsSections.value![0].lUnits[0]
      }

      this.bsUnit.next(aUnit)
    })
  }

  setUnit(aUnit: Unit | null) {
    if (aUnit !== null) this.bsUnit.next(aUnit)
  }

  uploadUnitPlayer(aUnit: Unit | null) {
    this.api.safePost('webinar/auth/unit-player', aUnit, null)
  }

  // + 1
  nextUnit() {
    // current unit
    let aCurrentUnit = this.bsUnit.value

    // save settings
    this.uploadUnitPlayer(aCurrentUnit)

    // loop through units till match is found
    let bMatch = false
    loop1:
      for (let i = 0; i < this.bsSections.value?.length!; i++) {
        let aSection = this.bsSections.value![i]
        loop2:
          for (let j = 0; j < aSection.lUnits?.length; j++) {
            let aUnit = aSection.lUnits[j]
            if (bMatch) {
              if (aUnit.oUnitPlayer === null || aUnit.oUnitPlayer?.tStatus! < 2 || true) {
                this.bsUnit.next(aUnit)
                break loop1
              }
            }
            if (aUnit.id === aCurrentUnit?.id) {
              bMatch = true
            }
          }
      }
  }

  // - 1
  lastUnit(): Unit | null{
    let aCurrentUnit = this.bsUnit.value

    // save settings
    this.uploadUnitPlayer(aCurrentUnit)

    // find next unit and set it to current
    let bMatch = false
    let bSelected = false
    loop1:
      for (let i = this.bsSections.value?.length!-1; i >= 0; i--) {
        let aSection = this.bsSections.value![i]
        loop2:
          for (let j = aSection.lUnits?.length-1; j >= 0; j--) {
            let aUnit = aSection.lUnits[j]
            if (bMatch) {
              return aUnit
              //this.bsUnit.next(aUnit)
              bSelected = true
              break loop1

            }
            if (aUnit.id === aCurrentUnit?.id) {
              bMatch = true
            }
          }
      }
      return null
  }
}
