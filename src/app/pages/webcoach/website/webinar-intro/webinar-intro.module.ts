import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WebinarIntroPageRoutingModule } from './webinar-intro-routing.module';

import { WebinarIntroPage } from './webinar-intro.page';
import {SectionModule} from "../../../../components/webinar-intro/section/section.module";
import {FooterModule} from "../../../../components/footer/footer.module";
import {DialogWebinarIntroModule} from "../../../../dialogs/dialog-webinar-intro/dialog-webinar-intro.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WebinarIntroPageRoutingModule,
    SectionModule,
    FooterModule,
    DialogWebinarIntroModule,
    MatIconModule
  ],
  declarations: [WebinarIntroPage]
})
export class WebinarIntroPageModule {}
