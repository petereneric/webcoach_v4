import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWebinarPage } from './edit-webinar.page';

const routes: Routes = [
  {
    path: ':id',
    component: EditWebinarPage,
    children: [
      {
        path: 'kursplan',
        loadChildren: () => import('./units/units.module').then( m => m.UnitsPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWebinarPageRoutingModule {}
