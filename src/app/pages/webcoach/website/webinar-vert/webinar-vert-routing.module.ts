import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebinarVertPage } from './webinar-vert.page';
import {PaymentGuard} from "../../../../services/guards/payment-guard.service";
import {AuthGuard} from "../../../../services/guards/auth-guard.service";

const routes: Routes = [
  {
    //path: '',
    path: ':kWebinar',
    component: WebinarVertPage,
    //canActivate: [AuthGuard, PaymentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarVertPageRoutingModule {}
