import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebinarCartComponent} from "./webinar-cart.component";



@NgModule({
  declarations: [WebinarCartComponent],
  imports: [
    CommonModule
  ],
  exports: [WebinarCartComponent]
})
export class WebinarCartModule { }
