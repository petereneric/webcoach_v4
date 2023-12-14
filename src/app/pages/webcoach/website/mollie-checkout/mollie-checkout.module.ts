import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MollieCheckoutPage} from "./mollie-checkout.page";
import {MollieCheckoutRoutingModule} from "./mollie-checkout-routing.module";


@NgModule({
  declarations: [MollieCheckoutPage],
  imports: [
    CommonModule,
    MollieCheckoutRoutingModule
  ]
})
export class MollieCheckoutModule { }
