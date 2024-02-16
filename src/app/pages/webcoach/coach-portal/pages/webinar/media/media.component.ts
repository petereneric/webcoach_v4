import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Section} from "../../../../../../interfaces/section";
import {Unit} from "../../../../../../interfaces/unit";
import {MatDialog} from "@angular/material/dialog";
import {UnitDialog} from "./unit/unit.dialog";
import {SectionDialog} from "./section/section.dialog";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.sass']
})
export class MediaComponent implements OnInit {

  // data
  lSections: Section[] = []

  constructor(private route: ActivatedRoute, private svApi: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const kWebinar = params['id']
      this.svApi.safeGet('coach-portal/webinar/media/' + kWebinar, (lSections: Section[]) => {
        console.log(lSections)
        this.lSections = lSections
      })
    })

  }


  onClick_Section(aSection: Section) {
    const dialogSection = this.dialog.open(SectionDialog, {
      backdropClass: "d-backdrop",
    })
  }

  onClick_Unit(aUnit: Unit) {
    const dialogUnit = this.dialog.open(UnitDialog, {
      backdropClass: "d-backdrop",
    })
  }

  onDrop_Section($event: any) {

  }

  onDrop_Unit($event: any) {

  }

  onClick_AddSection() {

  }

  onClick_AddUnit(aSection: Section) {

  }
}
