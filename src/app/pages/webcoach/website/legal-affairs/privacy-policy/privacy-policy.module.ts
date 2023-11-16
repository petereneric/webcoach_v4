import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPage } from './privacy-policy.page';
import {FooterModule} from "../../../../../components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrivacyPolicyPageRoutingModule,
    FooterModule
  ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
