import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SectionComponent} from "./section.component";
import {UnitModule} from "../unit/unit.module";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [SectionComponent],
    imports: [
        CommonModule,
        UnitModule,
        MatIconModule
    ],
  exports: [SectionComponent]
})
export class SectionModule { }
