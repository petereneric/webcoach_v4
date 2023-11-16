import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { TestScrollPageRoutingModule } from './test-scroll-routing.module';

import { TestScrollPage } from './test-scroll.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TestScrollPageRoutingModule
  ],
  declarations: [TestScrollPage]
})
export class TestScrollPageModule {}
