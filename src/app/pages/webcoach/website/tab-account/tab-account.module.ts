import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabAccountComponent} from "./tab-account.component";
import {TitleModule} from "../../../../components/title/title.module";
import {TabAccountRoutingModule} from "./tab-account-routing.module";
import {MatIconModule} from "@angular/material/icon";
import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [TabAccountComponent],
  imports: [
    CommonModule,
    TitleModule,
    TabAccountRoutingModule,
    MatIconModule,
  ],
  exports: [TabAccountComponent]
})
export class TabAccountModule {



}
