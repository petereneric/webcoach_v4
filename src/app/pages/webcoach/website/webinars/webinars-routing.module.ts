import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebinarsPage } from './webinars.page';
import {AuthGuard} from "../../../../services/guards/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: WebinarsPage,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarsPageRoutingModule {}
