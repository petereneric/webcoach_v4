import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDataComponent} from "./user-data.component";
import {UserDataRoutingModule} from "./user-data-routing.module";
import {TitleModule} from "../../../../../components/title/title.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [UserDataComponent],
  imports: [
    CommonModule,
    UserDataRoutingModule,
    TitleModule,
    ReactiveFormsModule
  ],
  exports: [UserDataComponent]
})
export class UserDataModule { }
