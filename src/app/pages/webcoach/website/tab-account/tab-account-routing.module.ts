import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabAccountComponent} from "./tab-account.component";
import {UserDataComponent} from "./user-data/user-data.component";


const routes: Routes = [
  {
    path: '',
    component: TabAccountComponent,
    children: [
      {
        path: 'deine-daten',
        loadChildren: () => import('./user-data/user-data.module').then(m => m.UserDataModule),
        data: { animationState: 'Two' }
      },
      {
        path: '',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
        data: { animationState: 'One' }
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabAccountRoutingModule {
}
