import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabBookingsPage} from "./tab-bookings.page";

const routes: Routes = [
  {
    path: '',
    component: TabBookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabBookingsRoutingModule {
}
