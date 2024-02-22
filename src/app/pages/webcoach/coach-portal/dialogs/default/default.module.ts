import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultDialog} from "./default.dialog";
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [DefaultDialog],
  imports: [
    CommonModule,
    MatTooltipModule
  ]
})
export class DefaultModule { }
