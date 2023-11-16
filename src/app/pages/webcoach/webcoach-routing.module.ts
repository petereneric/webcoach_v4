import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebcoachPage } from './webcoach.page';

const routes: Routes = [
  {
    path: '',
    component: WebcoachPage,
    children: [
      {
        path: 'coach',
        loadChildren: () => import('./coach/coach.module').then(m => m.CoachPortalPageModule)
      },
      {
        path: '',
        loadChildren: () => import('./website/website.module').then( m => m.WebsitePageModule)
      },
    ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebcoachPageRoutingModule {}
