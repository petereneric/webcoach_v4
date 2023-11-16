import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebinarCoachComponent} from "./webinar-coach.component";



@NgModule({
  declarations: [WebinarCoachComponent],
  imports: [
    CommonModule,
  ],
  exports: [WebinarCoachComponent]
})
export class WebinarCoachModule { }
