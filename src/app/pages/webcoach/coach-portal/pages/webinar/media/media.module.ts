import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MediaComponent} from "./media.component";
import {InputComponent} from "../../../components/input/input.component";
import {PageHeaderModule} from "../../../components/page-header/page-header.module";

@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule,
    InputComponent,
    PageHeaderModule
  ],
  exports: [MediaComponent]
})
export class MediaModule { }
