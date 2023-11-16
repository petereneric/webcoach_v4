import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {LoginPageRoutingModule} from './login-routing.module';

import {LoginPage} from './login.page';
import {FooterModule} from "../../../../../components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginPageRoutingModule,
    FooterModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
