import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPage } from './privacy-policy.page';
import {FooterModule} from "../../../../../components/footer/footer.module";
import {TitleModule} from "../../../../../components/title/title.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PrivacyPolicyPageRoutingModule,
        FooterModule,
        TitleModule
    ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
