import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { LivePageRoutingModule } from './live-routing.module';

import { LivePage } from './live.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LivePageRoutingModule
  ],
  declarations: [LivePage],
  exports: [LivePage]
})
export class LivePageModule {}
