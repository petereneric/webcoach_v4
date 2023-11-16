import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebinarIntroPage } from './webinar-intro.page';
import {WebinarPlayerGuardService} from "../../../../services/guards/webinar-player-guard.service";

const routes: Routes = [
  {
    path: ':id',
    component: WebinarIntroPage,
    canActivate: [WebinarPlayerGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarIntroPageRoutingModule {}
