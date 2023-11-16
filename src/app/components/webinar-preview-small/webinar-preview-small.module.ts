import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebinarPreviewSmallComponent} from "./webinar-preview-small.component";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [WebinarPreviewSmallComponent],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [WebinarPreviewSmallComponent]
})
export class WebinarPreviewSmallModule { }
