import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { InvalidPageRoutingModule } from './invalid-routing.module';

import { InvalidPage } from './invalid.page';
import {FooterModule} from "../../../../../../components/footer/footer.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InvalidPageRoutingModule,
        FooterModule
    ],
  declarations: [InvalidPage]
})
export class InvalidPageModule {}
