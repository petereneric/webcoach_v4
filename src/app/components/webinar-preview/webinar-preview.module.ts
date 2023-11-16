import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebinarPreviewComponent} from "./webinar-preview.component";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [WebinarPreviewComponent],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [WebinarPreviewComponent]
})
export class WebinarPreviewModule { }
