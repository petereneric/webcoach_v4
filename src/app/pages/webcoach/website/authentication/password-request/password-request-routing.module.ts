import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordRequestPage } from './password-request.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordRequestPageRoutingModule {}
