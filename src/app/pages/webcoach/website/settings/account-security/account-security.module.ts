import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AccountSecurityPageRoutingModule } from './account-security-routing.module';

import { AccountSecurityPage } from './account-security.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccountSecurityPageRoutingModule
  ],
  declarations: [AccountSecurityPage]
})
export class AccountSecurityPageModule {}
