import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {FooterModule} from "../../../../components/footer/footer.module";
import {WebinarPreviewModule} from "../../../../components/webinar-preview/webinar-preview.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HomePageRoutingModule,
        FooterModule,
        WebinarPreviewModule
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
