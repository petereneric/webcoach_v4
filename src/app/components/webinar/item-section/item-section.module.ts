import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemSectionComponent} from "./item-section.component";
import {ItemUnitModule} from "../item-unit/item-unit.module";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ItemSectionComponent],
    imports: [
        CommonModule,
        ItemUnitModule,
        MatIconModule
    ],
  exports: [ItemSectionComponent]
})
export class ItemSectionModule { }
