import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSecurityPage } from './account-security.page';

const routes: Routes = [
  {
    path: '',
    component: AccountSecurityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountSecurityPageRoutingModule {}
