import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckoutPage} from "./checkout.page";
import {CheckoutRoutingModule} from "./checkout-routing.module";
import {UserDataModule} from "../../../../components/user-data/user-data.module";
import {TitleModule} from "../../../../components/title/title.module";
import {WebinarCartModule} from "../../../../components/webinar-cart/webinar-cart.module";



@NgModule({
  declarations: [CheckoutPage],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    UserDataModule,
    TitleModule,
    WebinarCartModule
  ]
})
export class CheckoutModule { }
