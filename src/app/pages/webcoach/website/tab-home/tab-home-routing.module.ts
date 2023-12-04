import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabHomeComponent} from "./tab-home.component";

const routes: Routes = [
  {
    path: '',
    component: TabHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabHomeRoutingModule {
}
