import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebinarPageRoutingModule } from './webinar-routing.module';

import { WebinarPage } from './webinar.page';
import {VjsPlayerModule} from "../../../../components/vjs-player/vjs-player.module";
import {ToolbarWebinarModule} from "../../../../components/toolbar-webinar/toolbar-webinar.module";
import {FooterModule} from "../../../../components/footer/footer.module";
import {ContentPageModule} from "./content/content.module";
import {OverviewPageModule} from "./overview/overview.module";
import {LivePageModule} from "./live/live.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WebinarPageRoutingModule,
    VjsPlayerModule,
    ToolbarWebinarModule,
    FooterModule,
    ContentPageModule,
    OverviewPageModule,
    LivePageModule,
    MatIconModule,

  ],
  declarations: [WebinarPage]
})
export class WebinarPageModule {}
