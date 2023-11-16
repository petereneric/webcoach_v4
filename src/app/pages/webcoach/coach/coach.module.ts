import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { CoachPortalPageRoutingModule } from './coach-routing.module';

import { CoachPage } from './coach.page';
import {ToolbarCoachModule} from "../../../components/toolbar-coach/toolbar-coach.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoachPortalPageRoutingModule,
        ToolbarCoachModule
    ],
  declarations: [CoachPage]
})
export class CoachPortalPageModule {}
