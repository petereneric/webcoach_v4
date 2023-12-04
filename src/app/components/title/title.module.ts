import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TitleComponent} from "./title.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [TitleComponent],
    imports: [
        CommonModule,
        MatIconModule
    ],
  exports: [TitleComponent]
})
export class TitleModule { }
