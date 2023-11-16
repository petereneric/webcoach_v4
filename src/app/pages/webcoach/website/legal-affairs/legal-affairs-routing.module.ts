import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalAffairsPage } from './legal-affairs.page';

const routes: Routes = [
  {
    path: '',
    component: LegalAffairsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalAffairsPageRoutingModule {}
