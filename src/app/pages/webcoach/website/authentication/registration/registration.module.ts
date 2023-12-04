import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import {FooterModule} from "../../../../../components/footer/footer.module";
import {TitleModule} from "../../../../../components/title/title.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RegistrationPageRoutingModule,
        ReactiveFormsModule,
        FooterModule,
        TitleModule
    ],
  declarations: [RegistrationPage]
})
export class RegistrationPageModule {}
