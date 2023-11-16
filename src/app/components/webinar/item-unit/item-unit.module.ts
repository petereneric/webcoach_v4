import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemUnitComponent} from "./item-unit.component";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [ItemUnitComponent],
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule
    ],
  exports: [ItemUnitComponent]
})
export class ItemUnitModule { }
