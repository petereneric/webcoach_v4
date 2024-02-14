import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachPage } from './coach.page';

const routes: Routes = [
  {
    path: '_',
    pathMatch: 'full',
    redirectTo: 'portal'
  },
  {
    path: '',
    children: [
      {
        path: 'portal',
        loadChildren: () => import('./portal/portal.module').then( m => m.PortalPageModule)
      },
      {
        path: 'kurs-bearbeiten',
        loadChildren: () => import('./edit-webinar/edit-webinar.module').then( m => m.EditWebinarPageModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachPortalPageRoutingModule {}
