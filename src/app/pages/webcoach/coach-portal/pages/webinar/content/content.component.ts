import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Section} from "../../../../../../interfaces/section";
import {Unit} from "../../../../../../interfaces/unit";
import {MatDialog} from "@angular/material/dialog";
import {UnitDialog} from "./unit-dialog/unit.dialog";
import {SectionDialog} from "./section-dialog/section.dialog";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {CoachPortalService} from "../../../coach-portal.service";
import {Webinar} from "../../../../../../interfaces/webinar";

@Component({
  selector: 'app-media',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  // data
  lSections: Section[] = []
  private kWebinar: number = 0

  @ViewChild(CdkDropList) placeholder: CdkDropList | undefined;
  public activeContainer;
  public source!: CdkDropList | null;
  public sourceIndex!: number;
  public target!: CdkDropList;
  public targetIndex!: number;

  constructor(private svCoachPortal: CoachPortalService, private route: ActivatedRoute, private svApi: ApiService, private dialog: MatDialog) {
    this.source = null;
  }

  ngOnInit(): void {

    /*
    this.route.params.subscribe(params => {
      console.log(params)
      this.kWebinar = params['id']
      console.log(this.kWebinar)
      this.svApi.safeGet('coach-portal/webinar/media/' + this.kWebinar, (lSections: Section[]) => {
        console.log('first', lSections)
        this.lSections = lSections
      })
    })

     */


    this.svCoachPortal.bsWebinar.subscribe(aWebinar => {
      if (aWebinar) {
        this.svApi.safeGet('coach-portal/webinar/content/' + aWebinar!.id, (lSections: Section[]) => {
          console.log('second', lSections)
          this.kWebinar = aWebinar!.id
          this.lSections = lSections
        })
      }
    })



  }


  onClick_Section(aSection: Section) {
    const dialogSection = this.dialog.open(SectionDialog, {
      data: aSection,
      backdropClass: "d-backdrop",
    })
  }

  onClick_Unit(lUnits: Unit[], aUnit: Unit) {
    const dialogUnit = this.dialog.open(UnitDialog, {
      data: aUnit,
      backdropClass: "d-backdrop",
    }).afterClosed().subscribe((aResponse) => {
      if (aResponse && aResponse.tCode === "DELETE") {
        lUnits.splice(lUnits.indexOf(aUnit), 1)
        this.updateUnitPositions(lUnits)
      }

    })
  }

  onDrop_Section($event: any) {

  }

  updateUnitPositions(lUnits: Unit[]) {
    console.log("here", lUnits)

    let data: any[] = []
    lUnits.forEach((unit, index) => {
      unit.nPosition = index
      let object = {
        kUnit: unit.id,
        nPosition: index
      }
      data.push(object)
    })

    this.svApi.safePost('coach-portal/webinar/content/unit-positions', data, null)
  }

  onClick_AddSection() {
    const aSection = {
      id: 0,
      kWebinar: this.kWebinar,
      cName: "",
      cDescription: "",
      nPosition: this.lSections.length,
      lUnits: [],
      bEdit: false,
      bExpand: false,
    }

    const dialogAddSection = this.dialog.open(SectionDialog, {
      data: aSection,
      backdropClass: "d-backdrop",
    }).afterClosed().subscribe((aSection: Section) => {
      console.log(aSection)
      if (aSection) this.lSections.push(aSection)
    })
  }

  onClick_AddUnit(aSection: Section) {
    const aUnit = {
      id: 0,
      dCreation: "",
      kSection: aSection.id,
      cName: "",
      cDescription: "",
      secDuration: 0,
      oUnitPlayer: null,
      imgThumbnail: "",
      bMaterial: false,
      lMaterials: [],
      bVideo: false,
      nPosition: aSection.lUnits.length,
      bSample: 0,
      lComments: [],
      lIntervals: [],
      lProgressThumbnails: [],
      nComments: 0,
      nLikes: 0,
      nCalls: 0,
    }

    const dialogAddUnit = this.dialog.open(UnitDialog, {
      data: aUnit,
      backdropClass: "d-backdrop",
    }).afterClosed().subscribe((aUnit: Unit) => {
      if (aUnit) aSection.lUnits.push(aUnit)
    })
  }

}
