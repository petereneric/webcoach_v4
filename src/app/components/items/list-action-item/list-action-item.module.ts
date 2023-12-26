import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListActionItemComponent} from "./list-action-item.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [ListActionItemComponent],
    imports: [
        CommonModule,
        MatIconModule
    ],
  exports: [ListActionItemComponent]
})
export class ListActionItemModule { }
