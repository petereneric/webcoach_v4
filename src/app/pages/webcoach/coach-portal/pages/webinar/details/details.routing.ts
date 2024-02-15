import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DetailsPage} from "./details.page";


const routes: Routes = [
  {
    path: '',
    component: DetailsPage,
    children: [],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRouting {}
