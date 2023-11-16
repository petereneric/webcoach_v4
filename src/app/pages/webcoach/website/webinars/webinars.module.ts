import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebinarsPageRoutingModule } from './webinars-routing.module';

import { WebinarsPage } from './webinars.page';
import {WebinarPreviewSmallModule} from "../../../../components/webinar-preview-small/webinar-preview-small.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebinarsPageRoutingModule,
        WebinarPreviewSmallModule
    ],
  declarations: [WebinarsPage]
})
export class WebinarsPageModule {}
