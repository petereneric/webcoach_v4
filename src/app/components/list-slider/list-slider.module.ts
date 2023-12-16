import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListSliderComponent} from "./list-slider.component";
import {ItemSectionModule} from "../webinar/item-section/item-section.module";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ListSliderComponent],
  imports: [
    CommonModule,
    ItemSectionModule,
    MatIconModule
  ],
  exports: [ListSliderComponent]
})
export class ListSliderModule { }
