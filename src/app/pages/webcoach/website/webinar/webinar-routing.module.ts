import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {WebinarPage} from './webinar.page';
import {AuthGuard} from "../../../../services/guards/auth-guard.service";
import {PaymentGuard} from "../../../../services/guards/payment-guard.service";

const routes: Routes = [
  {
    path: ':kWebinar',
    component: WebinarPage,
    canActivate: [AuthGuard, PaymentGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarPageRoutingModule {
}
