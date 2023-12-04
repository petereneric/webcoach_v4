import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuRoutingModule} from "./menu-routing.module";
import {MenuComponent} from "./menu.component";
import {MatIconModule} from "@angular/material/icon";
import {TitleModule} from "../../../../../components/title/title.module";



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatIconModule,
    TitleModule
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
