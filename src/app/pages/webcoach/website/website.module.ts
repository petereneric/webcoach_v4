import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsitePageRoutingModule } from './website-routing.module';
import {ToolbarModule} from "../../../components/toolbar/toolbar.module";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {WebsitePage} from "./website.page";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebsitePageRoutingModule,
        ToolbarModule,
        RouterModule,
        MatIconModule,
    ],
  declarations: [WebsitePage]
})
export class WebsitePageModule {}
