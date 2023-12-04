import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabFavouritesComponent} from "./tab-favourites.component";



@NgModule({
  declarations: [TabFavouritesComponent],
  imports: [
    CommonModule
  ],
  exports: [TabFavouritesComponent]
})
export class TabFavouritesModule { }
