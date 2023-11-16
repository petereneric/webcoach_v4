import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { OverviewPageRoutingModule } from './overview-routing.module';

import { OverviewPage } from './overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverviewPageRoutingModule
  ],
  declarations: [OverviewPage],
  exports: [OverviewPage]
})
export class OverviewPageModule {}
