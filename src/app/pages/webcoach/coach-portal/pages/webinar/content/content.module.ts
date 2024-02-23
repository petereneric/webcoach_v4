import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContentComponent} from "./content.component";
import {UnitDialog} from "./unit-dialog/unit.dialog";
import {SectionDialog} from "./section-dialog/section.dialog";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {PageHeaderModule} from "../../../components/page-header/page-header.module";
import {MatIconModule} from "@angular/material/icon";
import {UnitsComponent} from "./units/units.component";
import {CoachPortalModule} from "../../../coach-portal.module";
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [ContentComponent],
    imports: [
        CommonModule,
        CdkDropListGroup,
        CdkDropList,
        CdkDrag,
        PageHeaderModule,
        MatIconModule,
        UnitsComponent,
        CoachPortalModule,
        MatTooltipModule,
    ],
  exports: [ContentComponent]
})
export class ContentModule { }