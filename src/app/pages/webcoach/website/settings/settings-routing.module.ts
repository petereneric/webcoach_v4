import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    children: [
      {
        path: 'kontosicherheit',
        loadChildren: () => import('./account-security/account-security.module').then( m => m.AccountSecurityPageModule)
      },
      {
        path: 'adresse',
        loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
