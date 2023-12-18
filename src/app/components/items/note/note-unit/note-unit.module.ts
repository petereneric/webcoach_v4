import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NoteUnitComponent} from "./note-unit.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [NoteUnitComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [NoteUnitComponent]
})
export class NoteUnitModule { }
