import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from "./cookie-banner.component";



@NgModule({
  declarations: [CookieBannerComponent],
  imports: [
    CommonModule,
  ],
  exports: [CookieBannerComponent]
})
export class CookieBannerModule { }
