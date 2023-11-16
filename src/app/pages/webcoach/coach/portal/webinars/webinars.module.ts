import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebinarsPageRoutingModule } from './webinars-routing.module';

import { WebinarsPage } from './webinars.page';
import {WebinarCoachModule} from "../../../../../components/webinar-coach/webinar-coach.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebinarsPageRoutingModule,
        WebinarCoachModule,
        MatIconModule
    ],
  declarations: [WebinarsPage]
})
export class WebinarsPageModule {}
