import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabHomeComponent} from "./tab-home.component";
import {TabHomeRoutingModule} from "./tab-home-routing.module";
import {TitleModule} from "../../../../components/title/title.module";
import {WebinarPreviewModule} from "../../../../components/webinar-preview/webinar-preview.module";



@NgModule({
  declarations: [TabHomeComponent],
  imports: [
    CommonModule,
    TabHomeRoutingModule,
    TitleModule,
    WebinarPreviewModule
  ],
  exports: [TabHomeComponent]
})
export class TabHomeModule { }
