import {RouterModule, Routes} from "@angular/router";
import {CoachPortalPage} from "./coach-portal.page";
import {NgModule} from "@angular/core";
import {MediaComponent} from "./pages/webinar/media/media.component";
import {MediaModule} from "./pages/webinar/media/media.module";


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
      },
      {
        path: 'webinar/:id/medien',
        component: MediaComponent
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
