import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebinarsPage } from './webinars.page';

const routes: Routes = [
  {
    path: '',
    component: WebinarsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarsPageRoutingModule {}
