import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Section} from "../../../../../../interfaces/section";
import {Unit} from "../../../../../../interfaces/unit";
import {MatDialog} from "@angular/material/dialog";
import {UnitDialog} from "./unit/unit.dialog";
import {SectionDialog} from "./section/section.dialog";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.sass']
})
export class MediaComponent implements OnInit {

  // data
  lSections: Section[] = []

  @ViewChild(CdkDropList) placeholder: CdkDropList | undefined;
  public activeContainer;
  public source!: CdkDropList | null;
  public sourceIndex!: number;
  public target!: CdkDropList;
  public targetIndex!: number;

  constructor(private route: ActivatedRoute, private svApi: ApiService, private dialog: MatDialog) {
    this.source = null;
  }

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

  /*
  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = this.__indexOf(dropElement.parentElement!.children, (this.source ? phElement : sourceElement));
    let dropIndex = this.__indexOf(dropElement.parentElement!.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement!.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement!.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
  };

   */
}
