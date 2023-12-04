import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmationPage } from './confirmation.page';

const routes: Routes = [
  {
    path: 'token/:token',
    component: ConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmationPageRoutingModule {}


