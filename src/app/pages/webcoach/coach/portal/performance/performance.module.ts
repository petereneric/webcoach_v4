import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PerformancePageRoutingModule } from './performance-routing.module';

import { PerformancePage } from './performance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerformancePageRoutingModule
  ],
  declarations: [PerformancePage]
})
export class PerformancePageModule {}
