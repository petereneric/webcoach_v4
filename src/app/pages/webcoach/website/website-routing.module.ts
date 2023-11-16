import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {WebsitePage} from './website.page';

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
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '',
    component: WebsitePage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
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
        path: 'webinar-intro',
        loadChildren: () => import('./webinar-intro/webinar-intro.module').then( m => m.WebinarIntroPageModule)
      },
      {
        path: 'passwort-zurücksetzen',
        loadChildren: () => import('./authentication/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
      },
      {
        path: 'passwort-vergessen',
        loadChildren: () => import('./authentication/password-request/password-request.module').then( m => m.PasswordRequestPageModule)
      },
      {
        path: 'meine-kurse',
        loadChildren: () => import('./webinars/webinars.module').then( m => m.WebinarsPageModule)
      },
      {
        path: 'kontoeinstellungen',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      }
    ]
  },

  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsitePageRoutingModule {
}
