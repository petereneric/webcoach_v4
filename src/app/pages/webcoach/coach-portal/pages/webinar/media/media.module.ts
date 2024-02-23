import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MediaComponent} from "./media.component";



@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule
  ],
  exports: [MediaComponent]
})
export class MediaModule { }
