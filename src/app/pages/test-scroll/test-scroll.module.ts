import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { TestScrollPageRoutingModule } from './test-scroll-routing.module';

import { TestScrollPage } from './test-scroll.page';
import {AppModule} from "../../app.module";
import {ListDirective} from "../../directives/list.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TestScrollPageRoutingModule,
    ListDirective,
  ],
  declarations: [TestScrollPage],
})
export class TestScrollPageModule {}
