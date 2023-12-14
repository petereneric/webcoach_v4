import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WebinarPlayerGuardService} from "../../../../services/guards/webinar-player-guard.service";
import {MollieCheckoutPage} from "./mollie-checkout.page";

const routes: Routes = [
  {
    path: ':token',
    component: MollieCheckoutPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MollieCheckoutRoutingModule {}
