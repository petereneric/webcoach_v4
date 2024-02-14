import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Webinar} from "../../interfaces/webinar";
import {WebinarPlayer} from "../../interfaces/webinar-player";
import {ApiService} from "../api/api.service";
import {Section} from "../../interfaces/section";
import {Unit} from "../../interfaces/unit";
import {UnitPlayer} from "../../interfaces/unit-player";
import {Note} from "../../interfaces/note";
import {Comment} from "../../interfaces/comment"
import {CommentAnswer} from "../../interfaces/comment-answer";
import {Interval} from "../../interfaces/interval";
import {WebinarRepository} from "../repositories/webinar.repository";
import {WebinarPlayerRepository} from "../repositories/webinar-player.repository";
import {NoteRepository} from "../repositories/note.repository";
import {CommentRepository} from "../repositories/comment.repository";
import {UnitRepository} from "../repositories/unit.repository";
import {SectionRepository} from "../repositories/section.repository";
import {CoachService} from "./coach.service";
import {CoachRepository} from "../repositories/coach.repository";
import {CommentAnswerRepository} from "../repositories/comment-answer.repository";
import {UnitPlayerRepository} from "../repositories/unit-player.repository";

@Injectable({
  providedIn: 'root'
})
export class WebinarService {

  bsCoachThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsComment: BehaviorSubject<Comment | null> = new BehaviorSubject<Comment | null>(null)
  bsCommentAnswer: BehaviorSubject<CommentAnswer | null> = new BehaviorSubject<CommentAnswer | null>(null)
  bsCommentAnswerRegard: BehaviorSubject<CommentAnswer | null> = new BehaviorSubject<CommentAnswer | null>(null)
  bsNote: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsSection: BehaviorSubject<Section | null> = new BehaviorSubject<Section | null>(null)
  bsSections: BehaviorSubject<Section[] | null> = new BehaviorSubject<Section[] | null>(null)
  bsUnit: BehaviorSubject<Unit | null> = new BehaviorSubject<Unit | null>(null)
  bsUnitInterval: BehaviorSubject<Interval | null> = new BehaviorSubject<Interval | null>(null)
  bsUnitThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsUnitThumbnailLast: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsUnitThumbnailNext: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  bsWebinar: BehaviorSubject<Webinar | null> = new BehaviorSubject<Webinar | null>(null)
  bsWebinarPlayer: BehaviorSubject<WebinarPlayer | null> = new BehaviorSubject<WebinarPlayer | null>(null)
  bsWebinarThumbnail: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  bsWebinarProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  bsSectionProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  bsUnitProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  constructor(private rUnitPlayer: UnitPlayerRepository, private rCommentAnswer: CommentAnswerRepository, private rCoach: CoachRepository, private rSection: SectionRepository, private rUnit: UnitRepository, private rComment: CommentRepository, private rNote: NoteRepository, private rWebinarPlayer: WebinarPlayerRepository, private rWebinar: WebinarRepository, private api: ApiService) {

    this.bsWebinar.subscribe((aWebinar) => {
      rWebinarPlayer.safeGet_WebinarPlayer(aWebinar?.id, aWebinarPlayer => {
        console.log("naaa Toll: ", aWebinarPlayer)
        if (aWebinarPlayer) {
          this.bsWebinarPlayer.next(aWebinarPlayer)
        } else {

          console.log("id", aWebinar?.id)
          if (aWebinar) {
            rWebinarPlayer.safePut_WebinarPlayer(aWebinar.id, aWebinarPlayer => {
              this.bsWebinarPlayer.next(aWebinarPlayer)
            })
          }

        }

      })
    })

    this.bsSection.subscribe((aSection) => {
      this.setCurrentSectionProgress()
    })

    this.bsUnit.subscribe((aUnit) => {
      this.setSection(aUnit)
      this.setUnitThumbnails()
      this.setCurrentUnitProgress()

      if (aUnit?.oUnitPlayer?.lNotes === undefined || aUnit?.oUnitPlayer?.lNotes === null) {
        this.rNote.safeGet_Notes(aUnit!.oUnitPlayer!.id, (lNotes: Note[]) => aUnit!.oUnitPlayer!.lNotes = lNotes)
      }

      if (aUnit?.lComments === undefined || aUnit?.lComments === null) {
        this.rComment.safeGet_Comments(aUnit!.id, (lComments: Comment[]) => aUnit!.lComments = lComments)
      }

      // intervals
      if (aUnit?.lIntervals === null || aUnit?.lIntervals === undefined || aUnit?.lIntervals.length === 0) {
        const nIntervals = Math.floor(aUnit!.secDuration / 30)
        console.log("nIntervals", nIntervals)
        for (let i = 0; i <= nIntervals; i++) {
          const secStart = i === 0 ? 0 : i * 30 + 1
          const secEnd = i === nIntervals ? aUnit!.secDuration : (i + 1) * 30
          let aInterval: Interval = {index: i, secStart: secStart, secEnd: secEnd, urlImage: null}
          if (aUnit?.lIntervals === undefined) aUnit!.lIntervals = []
          console.log(aUnit?.lIntervals)
          aUnit?.lIntervals.push(aInterval)
        }
        console.log(aUnit?.lIntervals)
      }

      aUnit?.lIntervals.forEach((aInterval: Interval) => {
        if (aInterval.urlImage === null) {
          this.api.getImage('webinar/unit/interval-thumbnail/' + aUnit?.id + '/' + aInterval.index, urlThumbnailInterval => {
            aInterval.urlImage = urlThumbnailInterval
            console.log("new aInterval set on lIntervals of unit", aInterval)
          })
        }
      })

      if (aUnit?.lProgressThumbnails === undefined || aUnit.lProgressThumbnails === null || aUnit.lProgressThumbnails.length === 0) {
        this.rUnit.safeGet_ProcessThumbnails(aUnit?.id, lProcessThumbnails => aUnit!.lProgressThumbnails = lProcessThumbnails)
      }
    })
  }

  load(kWebinar: number) {
    this.loadWebinar(kWebinar)
  }

  loadWebinar(kWebinar: number) {
    this.rWebinar.safeGet_Webinar(kWebinar, (aWebinar: Webinar) => {
      this.bsWebinar.next(aWebinar)
      this.loadSections(kWebinar)
      this.loadCoachThumbnail(aWebinar.oCoach.id)
    })
  }

  loadSections(kWebinar: number) {
    this.rSection.safeGet_Sections(kWebinar, (lSections: Section[]) => {
      console.log("SEEECTIONS", lSections)
      this.bsSections.next(lSections)
      this.loadUnit(kWebinar)
      this.setWebinarProgress()
    })
  }

  loadUnit(kWebinar: number) {
    console.log(kWebinar)
    this.rWebinarPlayer.safeGet_WebinarPlayer(kWebinar, aWebinarPlayer => {
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
    this.rWebinar.get_Thumbnail(kWebinar, (urlImage: any) => this.bsWebinarThumbnail.next(urlImage))
  }

  loadCoachThumbnail(kCoach: number) {
    this.rCoach.safeGet_Thumbnail(kCoach, urlThumbnail => this.bsCoachThumbnail.next(urlThumbnail))
  }

  loadCommentAnswers(aComment: Comment) {
    if (aComment.lCommentAnswers === undefined || aComment.lCommentAnswers === null || aComment.lCommentAnswers.length === 0) {
      this.rCommentAnswer.safeGet_CommentAnswers(aComment.id, (lCommentAnswers: CommentAnswer[]) => aComment.lCommentAnswers = lCommentAnswers)
    }
  }

  setUnit(aUnit: Unit | null) {
    this.uploadUnitPlayer()
    if (aUnit !== null) this.bsUnit.next(aUnit)
  }

  checkUnitPlayer(aUnitPlayer = this.bsUnit.value!.oUnitPlayer!) {
    this.setUnitPlayerStatus(aUnitPlayer.tStatus! < 2 ? 2 : 1, aUnitPlayer)
    this.uploadUnitPlayer(aUnitPlayer)
  }

  setUnitPlayerStatus(tStatus, aUnitPlayer = this.bsUnit.value!.oUnitPlayer!) {
    aUnitPlayer.tStatus = tStatus
    if (aUnitPlayer.id === this.bsUnit.value!.oUnitPlayer!.id) this.bsUnit.value!.oUnitPlayer!.tStatus = tStatus
  }

  setUnitPlayerTime(secVideo: number, aUnitPlayer: UnitPlayer = this.bsUnit.value!.oUnitPlayer!) {
    aUnitPlayer.secVideo = secVideo
    if (aUnitPlayer.tStatus < 1 && secVideo > 0) {
      this.setUnitPlayerStatus(1, aUnitPlayer)
    }
  }

  uploadUnitPlayer(aUnitPlayer: UnitPlayer = this.bsUnit.value?.oUnitPlayer!, callback: any = null) {
    console.log("UPDATE UNIT PLAYER")
    console.log(aUnitPlayer)
    const data = {
      kUnit: aUnitPlayer.kUnit,
      tStatus: aUnitPlayer.tStatus,
      secVideo: aUnitPlayer.secVideo,
    }
    console.log(data)
    this.rUnitPlayer.safePost_UnitPlayer(data, callback)
  }


  updateWebinarPlayer() {
    const data = {
      kWebinar: this.bsWebinar.value?.id,
      kCurrentUnit: this.bsUnit.value?.id
    }
    this.rWebinarPlayer.safePost_WebinarPlayer(data)
  }


  // + 1
  setNextUnit() {
    console.log("CHHANGE 1")
    this.bsSection.value?.lUnits.forEach(aUnit => {
      if (aUnit.id === this.bsUnit.value!.id) {
        //aUnit.oUnitPlayer!.secVideo = secVideo
        // TODO Status
      }
    })
    //this.bsUnit.value!.oUnitPlayer!.secVideo = secVideo
    /*
    if (secVideo > 0 && this.bsUnit.value!.oUnitPlayer!.tStatus == 0) {
      this.bsUnit.value!.oUnitPlayer!.tStatus = 1
    }

     */
    console.log("NEEXT", this.bsUnit.value?.oUnitPlayer!)
    this.setUnit(this.getNextUnit())
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

  setLastUnit() {
    this.setUnit(this.getLastUnit())
  }

  // - 1
  getLastUnit(): Unit | null {
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
      console.log("next thumbnail", urlThumbnail)
      console.log(urlThumbnail)
      this.bsUnitThumbnail.next(urlThumbnail)
    })

    // last
    const aLastUnit = this.getLastUnit()

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

  sortNotes() {
    this.bsUnit.value!.oUnitPlayer!.lNotes = this.bsUnit.value!.oUnitPlayer!.lNotes!.sort((a, b) => a.secTime - b.secTime)
  }

  sortComments() {
    this.bsUnit.value!.lComments = this.bsUnit.value!.lComments!.sort((a, b) => (a.dtCreation as any) - (b.dtCreation as any))
  }

  setWebinarProgress() {
    if (this.bsSections.value != null) {
      let nUnitsChecked = 0
      let nUnits = 0
      this.bsSections.value?.forEach(aSection => {
        aSection.lUnits.forEach(aUnit => {
          nUnits++
          if (aUnit.oUnitPlayer !== null && aUnit.oUnitPlayer.tStatus === 2) nUnitsChecked++
        })
      })
      this.bsWebinarProgress.next(Number((nUnitsChecked / nUnits).toFixed(2)))
    }
  }

  setCurrentSectionProgress() {
    let nUnitsChecked = 0
    let nUnits = 0
    this.bsSection.value?.lUnits.forEach(aUnit => {
      nUnits++
      if (aUnit.oUnitPlayer !== null && aUnit.oUnitPlayer.tStatus === 2) nUnitsChecked++
    })
    this.bsSectionProgress.next(Number((nUnitsChecked / nUnits).toFixed(2)))
  }

  setCurrentUnitProgress() {
    const secProgress = this.bsUnit.value?.oUnitPlayer?.secVideo ?? 0
    const secTotal = this.bsUnit.value?.secDuration!
    this.bsUnitProgress.next(Number((secProgress / secTotal).toFixed(2)))
  }

}
