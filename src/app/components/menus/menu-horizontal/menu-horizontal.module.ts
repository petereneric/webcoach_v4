import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuHorizontalComponent} from "./menu-horizontal.component";



@NgModule({
  declarations: [MenuHorizontalComponent],
  imports: [
    CommonModule
  ],
  exports: [MenuHorizontalComponent]
})
export class MenuHorizontalModule { }
