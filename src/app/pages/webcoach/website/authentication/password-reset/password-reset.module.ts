import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { PasswordResetPageRoutingModule } from './password-reset-routing.module';

import { PasswordResetPage } from './password-reset.page';
import {FooterModule} from "../../../../../components/footer/footer.module";
import {TitleModule} from "../../../../../components/title/title.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordResetPageRoutingModule,
        ReactiveFormsModule,
        FooterModule,
        TitleModule,
    ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule {}
