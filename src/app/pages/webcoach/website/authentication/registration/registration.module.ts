import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import {FooterModule} from "../../../../../components/footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegistrationPageRoutingModule,
    ReactiveFormsModule,
    FooterModule
  ],
  declarations: [RegistrationPage]
})
export class RegistrationPageModule {}
