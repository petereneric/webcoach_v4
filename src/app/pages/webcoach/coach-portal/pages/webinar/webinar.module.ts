import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebinarRouting} from "./webinar.routing";
import {WebinarPage} from "./webinar.page";



@NgModule({
  declarations: [WebinarPage],
  imports: [
    CommonModule,
    WebinarRouting
  ]
})
export class WebinarModule { }
