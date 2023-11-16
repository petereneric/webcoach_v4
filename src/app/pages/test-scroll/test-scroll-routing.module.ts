import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestScrollPage } from './test-scroll.page';

const routes: Routes = [
  {
    path: '',
    component: TestScrollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestScrollPageRoutingModule {}
