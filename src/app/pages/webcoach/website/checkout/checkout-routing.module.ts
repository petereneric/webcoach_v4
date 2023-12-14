import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CheckoutPage} from "./checkout.page";

const routes: Routes = [
  {
    path: ':kWebinar',
    component: CheckoutPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CheckoutRoutingModule {}
