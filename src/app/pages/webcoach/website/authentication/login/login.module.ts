import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {LoginPageRoutingModule} from './login-routing.module';

import {LoginPage} from './login.page';
import {FooterModule} from "../../../../../components/footer/footer.module";
import {TitleModule} from "../../../../../components/title/title.module";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginPageRoutingModule,
    FooterModule,
    ReactiveFormsModule,
    TitleModule,
    MatInputModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
