import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


import {WebinarVertPageRoutingModule} from './webinar-vert-routing.module';

import {WebinarVertPage} from './webinar-vert.page';
import {VjsPlayerModule} from "../../../../components/vjs-player/vjs-player.module";
import {MatIconModule} from "@angular/material/icon";
import {ItemSectionModule} from "../../../../components/webinar/item-section/item-section.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WebinarVertPageRoutingModule,
    VjsPlayerModule,
    MatIconModule,
    ItemSectionModule,
  ],
  declarations: [WebinarVertPage]
})
export class WebinarVertPageModule {
}
