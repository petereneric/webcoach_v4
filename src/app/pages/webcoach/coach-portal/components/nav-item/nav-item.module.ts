import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavItemComponent} from "./nav-item.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [NavItemComponent],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [NavItemComponent]
})
export class NavItemModule { }
