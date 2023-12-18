import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListActionComponent} from "./list-action.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ListActionComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [ListActionComponent]
})
export class ListActionModule { }
