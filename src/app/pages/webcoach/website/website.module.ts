import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebsitePageRoutingModule } from './website-routing.module';

import { WebsitePage } from './website.page';
import {ToolbarModule} from "../../../components/toolbar/toolbar.module";
import {ToolbarWebinarModule} from "../../../components/toolbar-webinar/toolbar-webinar.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebsitePageRoutingModule,
        ToolbarModule,
        RouterModule,
    ],
  declarations: [WebsitePage]
})
export class WebsitePageModule {}
