import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Webinar} from "../../interfaces/webinar";
import {B} from "@angular/cdk/keycodes";
import {ConnApiService} from "../conn-api/conn-api.service";
import {Section} from "../../interfaces/section";
import {Unit} from "../../interfaces/unit";
import {UnitPlayer} from "../../interfaces/unit-player";

@Injectable({
  providedIn: 'root'
})
export class WebinarService {

  bsWebinar: BehaviorSubject<Webinar | null> = new BehaviorSubject<Webinar | null>(null)
  bsWebinarThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsSections: BehaviorSubject<Section[] | null> = new BehaviorSubject<Section[] | null>(null)
  bsSection: BehaviorSubject<Section | null> = new BehaviorSubject<Section | null>(null)
  bsUnit: BehaviorSubject<Unit | null> = new BehaviorSubject<Unit | null>(null)
  bsCoachThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsUnitThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsUnitThumbnailNext: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsUnitThumbnailLast: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private api: ConnApiService) {
    this.bsWebinar.subscribe((aWebinar) => {

    })

    this.bsUnit.subscribe((aUnit) => {
      this.setSection(aUnit)
      this.setUnitThumbnails()
    })
  }

  load(kWebinar: number) {
    this.loadWebinar(kWebinar)
  }

  loadWebinar(kWebinar: number) {
    this.api.get('webinar/' + kWebinar, (aWebinar: Webinar) => {
      this.bsWebinar.next(aWebinar)

      this.loadSections(kWebinar)
      this.loadCoachThumbnail(aWebinar.oCoach.id)
    })
  }

  loadSections(kWebinar: number) {
    this.api.safeGet('webinar/auth/sections/' + kWebinar, (lSections: Section[]) => {
      this.bsSections.next(lSections)
      console.log(lSections)
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

  loadWebinarThumbnail(kWebinar: number) {
    this.api.getImage('webinar/cover/' +  kWebinar, (urlImage: any) => {
      console.log("loaded")
      console.log(urlImage)
      this.bsWebinarThumbnail.next(urlImage)
    })
  }

  loadCoachThumbnail(kCoach: number) {

    this.api.safeDownloadImage('webinar/coach/thumbnail/' + kCoach, (urlThumbnail: any) => {
      this.bsCoachThumbnail.next(urlThumbnail)
      console.log("HELLLLO")
      console.log(urlThumbnail)
    })
  }

  setUnit(aUnit: Unit | null, secVideo = 0) {
    this.bsUnit.value!.oUnitPlayer!.secVideo = secVideo
    if (secVideo > 0 && this.bsUnit.value!.oUnitPlayer!.tStatus == 0) {
      this.bsUnit.value!.oUnitPlayer!.tStatus = 1
    }
    this.uploadUnitPlayer(this.bsUnit.value?.oUnitPlayer!)

    if (aUnit !== null) this.bsUnit.next(aUnit)
  }


  uploadUnitPlayer(aUnitPlayer: UnitPlayer | null) {
    console.log(aUnitPlayer)
    this.api.safePost('webinar/auth/unit-player', aUnitPlayer, null)
  }


  updateWebinarPlayer() {
    const data = {
      kWebinar: this.bsWebinar.value?.id,
      kCurrentUnit: this.bsUnit.value?.id
    }

    this.api.safePost('webinar/auth/webinar-player', data, () => {})
  }


  // + 1
  setNextUnit(secVideo = 0) {
    this.bsUnit.value!.oUnitPlayer!.secVideo = secVideo
    if (secVideo > 0 && this.bsUnit.value!.oUnitPlayer!.tStatus == 0) {
      this.bsUnit.value!.oUnitPlayer!.tStatus = 1
    }
    this.uploadUnitPlayer(this.bsUnit.value?.oUnitPlayer!)
    this.bsUnit.next(this.getNextUnit())
  }

  getNextUnit() {
    // current unit
    let aCurrentUnit = this.bsUnit.value

    // save settings
    //this.uploadUnitPlayer(aCurrentUnit)

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
                return aUnit
                break loop1
              }
            }
            if (aUnit.id === aCurrentUnit?.id) {
              bMatch = true
            }
          }
      }

    return null
  }

  // - 1
  lastUnit(): Unit | null {
    let aCurrentUnit = this.bsUnit.value

    // save settings
    //this.uploadUnitPlayer(aCurrentUnit)

    // find next unit and set it to current
    let bMatch = false
    let bSelected = false
    loop1:
      for (let i = this.bsSections.value?.length! - 1; i >= 0; i--) {
        let aSection = this.bsSections.value![i]
        loop2:
          for (let j = aSection.lUnits?.length - 1; j >= 0; j--) {
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

  setSection(aUnit: Unit | null) {
    this.bsSection.next(this.bsSections.value?.find(section => section['id'] === aUnit?.kSection) ?? null)
  }

  setUnitThumbnails() {

    // current
    this.api.safeDownloadImage('webinar/unit/thumbnail/' + this.bsUnit.value?.id, (urlThumbnail: any) => {
      this.bsUnitThumbnail.next(urlThumbnail)
    })

    // last
    const aLastUnit = this.lastUnit()

    if (aLastUnit !== null) {
      this.api.safeDownloadImage('webinar/unit/thumbnail/' + aLastUnit?.id, (urlThumbnail: any) => {
        this.bsUnitThumbnailLast.next(urlThumbnail)
      })
    } else {
      this.bsUnitThumbnailLast.next(null)
    }

    // next
    const aNextUnit = this.getNextUnit()

    if (aNextUnit !== null) {
      this.api.safeDownloadImage('webinar/unit/thumbnail/' + aNextUnit?.id, (urlThumbnail: any) => {
        this.bsUnitThumbnailNext.next(urlThumbnail)
      })
    } else {
      this.bsUnitThumbnailNext.next(null)
    }
  }
}
