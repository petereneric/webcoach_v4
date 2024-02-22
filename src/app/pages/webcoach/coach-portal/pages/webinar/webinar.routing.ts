import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {WebinarPage} from "./webinar.page";
import {MediaComponent} from "./media/media.component";


const routes: Routes = [
  {
    path: ':id',
    component: WebinarPage,
    children: [
      {
        path: 'details',
        loadChildren: () => import('./details/details.module').then(m => m.DetailsModule)
      },
      {
        path: 'medien',
        component: MediaComponent
      }
    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebinarRouting {}
