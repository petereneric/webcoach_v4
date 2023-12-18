import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListActionItemComponent} from "./list-action-item.component";



@NgModule({
  declarations: [ListActionItemComponent],
  imports: [
    CommonModule
  ],
  exports: [ListActionItemComponent]
})
export class ListActionItemModule { }
