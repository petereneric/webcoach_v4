import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabBookingsPage} from "./tab-bookings.page";
import {TitleModule} from "../../../../components/title/title.module";
import {TabBookingsRoutingModule} from "./tab-bookings-routing.module";
import { ItemBookingComponent } from './item-booking/item-booking.component';



@NgModule({
  declarations: [TabBookingsPage, ItemBookingComponent],
  imports: [
    CommonModule,
    TitleModule,
    TabBookingsRoutingModule
  ],
  exports: []
})
export class TabBookingsModule { }
