import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabHomeComponent} from "../tab-home/tab-home.component";
import {TabSearchComponent} from "./tab-search.component";



@NgModule({
  declarations: [TabSearchComponent],
  imports: [
    CommonModule
  ],
  exports: [TabSearchComponent]
})
export class TabSearchModule { }
