import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ContentPageRoutingModule } from './content-routing.module';

import { ContentPage } from './content.page';
import {ItemSectionModule} from "../../../../../components/webinar/item-section/item-section.module";
import {ItemUnitModule} from "../../../../../components/webinar/item-unit/item-unit.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ContentPageRoutingModule,
        ItemSectionModule,
        ItemUnitModule
    ],
    exports: [
        ContentPage
    ],
    declarations: [ContentPage]
})
export class ContentPageModule {}
