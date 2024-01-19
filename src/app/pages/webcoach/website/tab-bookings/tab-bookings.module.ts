import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabBookingsPage} from "./tab-bookings.page";
import {TitleModule} from "../../../../components/title/title.module";
import {TabBookingsRoutingModule} from "./tab-bookings-routing.module";
import { ItemBookingComponent } from './item-booking/item-booking.component';
import {LoadDirective} from "../../../../directives/load.directive";



@NgModule({
  declarations: [TabBookingsPage, ItemBookingComponent],
  imports: [
    CommonModule,
    TitleModule,
    TabBookingsRoutingModule,
    LoadDirective,
  ],
  exports: []
})
export class TabBookingsModule { }
