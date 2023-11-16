import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PortalPageRoutingModule } from './portal-routing.module';

import { PortalPage } from './portal.page';
import {ToolbarCoachModule} from "../../../../components/toolbar-coach/toolbar-coach.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PortalPageRoutingModule,
        ToolbarCoachModule
    ],
  declarations: [PortalPage]
})
export class PortalPageModule {}
