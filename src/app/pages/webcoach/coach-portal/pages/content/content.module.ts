import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContentRouting} from "./content.routing";
import { WebinarsPage } from './webinars/webinars.page';



@NgModule({
  declarations: [
    WebinarsPage
  ],
  imports: [
    CommonModule,
    ContentRouting
  ]
})
export class ContentModule { }
