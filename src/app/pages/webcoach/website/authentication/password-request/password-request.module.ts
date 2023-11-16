import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { PasswordRequestPageRoutingModule } from './password-request-routing.module';

import { PasswordRequestPage } from './password-request.page';
import {FooterModule} from "../../../../../components/footer/footer.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordRequestPageRoutingModule,
        FooterModule,
        ReactiveFormsModule
    ],
  declarations: [PasswordRequestPage]
})
export class PasswordRequestPageModule {}
