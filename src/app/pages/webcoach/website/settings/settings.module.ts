import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import {MenuHorizontalModule} from "../../../../components/menus/menu-horizontal/menu-horizontal.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SettingsPageRoutingModule,
        MenuHorizontalModule
    ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
