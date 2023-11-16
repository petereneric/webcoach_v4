import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { LegalAffairsPageRoutingModule } from './legal-affairs-routing.module';

import { LegalAffairsPage } from './legal-affairs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LegalAffairsPageRoutingModule
  ],
  declarations: [LegalAffairsPage]
})
export class LegalAffairsPageModule {}
