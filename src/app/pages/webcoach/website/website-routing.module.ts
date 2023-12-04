import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {WebsitePage} from './website.page';
import {UserDataComponent} from "./tab-account/user-data/user-data.component";

const routes: Routes = [
  {
    path: 'webinar',
    loadChildren: () => import('./webinar/webinar.module').then(m => m.WebinarPageModule)
  },
  {
    path: 'webinar-vert',
    loadChildren: () => import('./webinar-vert/webinar-vert.module').then( m => m.WebinarVertPageModule)
  },
  {
    path: 'webinar-intro',
    loadChildren: () => import('./webinar-intro/webinar-intro.module').then( m => m.WebinarIntroPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'buchungen'
  },
  {
    path: '',
    component: WebsitePage,
    children: [
      {
        path: 'start',
        loadChildren: () => import('./tab-home/tab-home.module').then(m => m.TabHomeModule)
      },
      {
        path: 'suchen',
        //loadChildren: () => import('./tab-search/tab-search.module').then(m => m.TabSearchModule)
        loadChildren: () => import('./tab-home/tab-home.module').then(m => m.TabHomeModule)
      },
      {
        path: 'buchungen',
        loadChildren: () => import('./tab-bookings/tab-bookings.module').then(m => m.TabBookingsModule)
      },
      {
        path: 'merkliste',
        //loadChildren: () => import('./tab-favourites/tab-favourites.module').then(m => m.TabFavouritesModule)
        loadChildren: () => import('./tab-home/tab-home.module').then(m => m.TabHomeModule)
      },
      {
        path: 'konto',
        loadChildren: () => import('./tab-account/tab-account.module').then(m => m.TabAccountModule)
      },
      {
        path: 'tab-home',
        loadChildren: () => import('./tab-home/tab-home.module').then(m => m.TabHomeModule)
      },
      {
        path: 'impressum',
        loadChildren: () => import('./legal-affairs/impressum/impressum.module').then(m => m.ImpressumPageModule)
      },
      {
        path: 'datenschutzbestimmungen',
        loadChildren: () => import('./legal-affairs/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      },
      {
        path: 'legal-affairs',
        loadChildren: () => import('./legal-affairs/legal-affairs.module').then(m => m.LegalAffairsPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./authentication/login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'registrierung',
        loadChildren: () => import('./authentication/registration/registration.module').then( m => m.RegistrationPageModule)
      },

      {
        path: 'passwort-zurücksetzen',
        loadChildren: () => import('./authentication/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
      },
      {
        path: 'passwort-vergessen',
        loadChildren: () => import('./authentication/password-request/password-request.module').then( m => m.PasswordRequestPageModule),
      },
      {
        path: 'meine-kurse',
        loadChildren: () => import('./webinars/webinars.module').then( m => m.WebinarsPageModule)
      },
      {
        path: 'kontoeinstellungen',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'deine-daten',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'test-scroll',
        loadChildren: () => import('../../../pages/test-scroll/test-scroll.module').then( m => m.TestScrollPageModule)
      },
    ]
  },

  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: '**',
    redirectTo: 'start'
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsitePageRoutingModule {
}
