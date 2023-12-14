import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDataComponent} from "./user-data.component";
import {TitleModule} from "../title/title.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [UserDataComponent],
  imports: [
    CommonModule,
    TitleModule,
    ReactiveFormsModule
  ],
  exports: [UserDataComponent]
})
export class UserDataModule { }
