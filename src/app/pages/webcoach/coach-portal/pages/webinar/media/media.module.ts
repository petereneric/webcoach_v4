import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MediaComponent} from "./media.component";
import {UnitDialog} from "./unit/unit.dialog";
import {SectionDialog} from "./section/section.dialog";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {PageHeaderModule} from "../../../components/page-header/page-header.module";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [MediaComponent, UnitDialog, SectionDialog],
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    PageHeaderModule,
    MatIconModule,
  ],
  exports: [MediaComponent]
})
export class MediaModule { }
