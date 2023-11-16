import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebcoachPageRoutingModule } from './webcoach-routing.module';

import { WebcoachPage } from './webcoach.page';
import {CookieBannerModule} from "../../components/cookie-banner/cookie-banner.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WebcoachPageRoutingModule,
    CookieBannerModule
  ],
  declarations: [WebcoachPage]
})
export class WebcoachPageModule {}
