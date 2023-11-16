import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UnitComponent} from "./unit.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [UnitComponent],
    imports: [
        CommonModule,
        MatIconModule,
    ],
  exports: [UnitComponent]
})
export class UnitModule { }
