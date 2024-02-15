import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DetailsPage} from "./details.page";
import {DetailsRouting} from "./details.routing";
import {PageHeaderModule} from "../../../components/page-header/page-header.module";
import {CoachPortalModule} from "../../../coach-portal.module";



@NgModule({
  declarations: [DetailsPage],
  imports: [
    CommonModule,
    DetailsRouting,
    PageHeaderModule,
    CoachPortalModule
  ]
})
export class DetailsModule { }
