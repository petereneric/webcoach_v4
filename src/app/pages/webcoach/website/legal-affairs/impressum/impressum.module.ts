import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImpressumPageRoutingModule } from './impressum-routing.module';

import { ImpressumPage } from './impressum.page';
import {FooterModule} from "../../../../../components/footer/footer.module";
import {TitleModule} from "../../../../../components/title/title.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ImpressumPageRoutingModule,
        FooterModule,
        TitleModule
    ],
  declarations: [ImpressumPage]
})
export class ImpressumPageModule {}
