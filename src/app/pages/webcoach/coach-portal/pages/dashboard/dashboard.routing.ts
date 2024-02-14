import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DashboardPage} from "./dashboard.page";


const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {}
