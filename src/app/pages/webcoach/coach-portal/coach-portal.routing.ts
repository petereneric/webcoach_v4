import {RouterModule, Routes} from "@angular/router";
import {CoachPortalPage} from "./coach-portal.page";
import {NgModule} from "@angular/core";


const routes: Routes = [
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
        path: 'webinar/:id/details',
        loadChildren: () => import('./pages/webinar/details/details.module').then(m => m.DetailsModule)
      }
    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachPortalRouting {
}
