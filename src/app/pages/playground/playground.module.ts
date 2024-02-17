import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PlaygroundPageRoutingModule } from './playground-routing.module';

import { PlaygroundPage } from './playground.page';
import {AppModule} from "../../app.module";
import {ListDirective} from "../../directives/list.directive";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlaygroundPageRoutingModule,
    ListDirective,
    CdkDropList,
    CdkDrag,
  ],
  declarations: [PlaygroundPage],
})
export class TestScrollPageModule {}
