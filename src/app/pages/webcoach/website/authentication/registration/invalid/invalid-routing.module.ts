import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvalidPage } from './invalid.page';

const routes: Routes = [
  {
    path: '',
    component: InvalidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvalidPageRoutingModule {}
