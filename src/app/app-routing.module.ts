import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'test-scroll',
    loadChildren: () => import('./pages/test-scroll/test-scroll.module').then( m => m.TestScrollPageModule)
  },
  {
    path: '', loadChildren: () => import('./pages/webcoach/webcoach.module').then( m => m.WebcoachPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
