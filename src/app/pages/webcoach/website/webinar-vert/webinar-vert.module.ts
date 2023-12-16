import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';


import {WebinarVertPageRoutingModule} from './webinar-vert-routing.module';

import {WebinarVertPage} from './webinar-vert.page';
import {VjsPlayerModule} from "../../../../components/vjs-player/vjs-player.module";
import {MatIconModule} from "@angular/material/icon";
import {ItemSectionModule} from "../../../../components/webinar/item-section/item-section.module";
import {ListSliderModule} from "../../../../components/list-slider/list-slider.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebinarVertPageRoutingModule,
        VjsPlayerModule,
        MatIconModule,
        ItemSectionModule,
        NgOptimizedImage,
        ListSliderModule,
    ],
  declarations: [WebinarVertPage]
})
export class WebinarVertPageModule {
}
