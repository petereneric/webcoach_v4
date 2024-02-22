import {RouterModule, Routes} from "@angular/router";
import {CoachPortalPage} from "./coach-portal.page";
import {NgModule} from "@angular/core";
import {MediaComponent} from "./pages/webinar/media/media.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    component: CoachPortalPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'inhalte',
        loadChildren: () => import('./pages/content/content.module').then(m => m.ContentModule)
      },
      {
        path: 'webinar',
        loadChildren: () => import('./pages/webinar/webinar.module').then(m => m.WebinarModule)
      },
    ],
  },

]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachPortalRouting {
}
