import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { EditWebinarPageRoutingModule } from './edit-webinar-routing.module';

import { EditWebinarPage } from './edit-webinar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditWebinarPageRoutingModule
  ],
  declarations: [EditWebinarPage]
})
export class EditWebinarPageModule {}
