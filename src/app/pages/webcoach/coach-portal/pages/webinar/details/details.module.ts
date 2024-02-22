import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DetailsPage} from "./details.page";
import {DetailsRouting} from "./details.routing";
import {PageHeaderModule} from "../../../components/page-header/page-header.module";
import {CoachPortalModule} from "../../../coach-portal.module";
import {InputComponent} from "../../../components/input/input.component";



@NgModule({
  declarations: [DetailsPage],
  imports: [
    CommonModule,
    DetailsRouting,
    PageHeaderModule,
    CoachPortalModule,
    InputComponent
  ]
})
export class DetailsModule { }
