import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarCoachComponent} from "./toolbar-coach.component";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ToolbarCoachComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule
    ],
  exports: [ToolbarCoachComponent]
})
export class ToolbarCoachModule { }
