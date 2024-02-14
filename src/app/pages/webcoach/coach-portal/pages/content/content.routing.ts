import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ContentPage} from "./content.page";
import {WebinarsPage} from "./webinars/webinars.page";


const routes: Routes = [
  {
    path: '',
    component: ContentPage,
    children: [{
      path: 'online-kurse',
      component: WebinarsPage
    }

    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRouting {}
