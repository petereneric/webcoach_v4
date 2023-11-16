import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortalPage } from './portal.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'kurse'
  },
  {
    path: '',
    component: PortalPage,
    children: [
      {
        path: 'kurse',
        loadChildren: () => import('./webinars/webinars.module').then(m => m.WebinarsPageModule)
      },
      {
        path: 'performance',
        loadChildren: () => import('./performance/performance.module').then(m => m.PerformancePageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalPageRoutingModule {}
