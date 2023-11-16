import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarWebinarComponent} from "./toolbar-webinar.component";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [ToolbarWebinarComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule
    ],
  exports: [ToolbarWebinarComponent]
})
export class ToolbarWebinarModule { }
