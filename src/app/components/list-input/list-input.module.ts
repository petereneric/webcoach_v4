import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListInputComponent} from "./list-input.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ListInputComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [ListInputComponent]
})
export class ListInputModule { }
