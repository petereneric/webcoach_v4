import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { UnitsPageRoutingModule } from './units-routing.module';

import { UnitsPage } from './units.page';
import {MatMenuModule} from "@angular/material/menu";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UnitsPageRoutingModule,
    MatMenuModule,
    CdkDropList,
    CdkDrag,
    MatIconModule
  ],
  declarations: [UnitsPage]
})
export class UnitsPageModule {}
