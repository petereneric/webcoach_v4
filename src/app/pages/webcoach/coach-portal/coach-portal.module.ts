import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CoachPortalRouting} from "../coach-portal/coach-portal.routing";
import {CoachPortalPage} from "./coach-portal.page";
import {MatIconModule} from "@angular/material/icon";
import { NavItemComponent } from './components/nav-item/nav-item.component';
import {NavItemModule} from "./components/nav-item/nav-item.module";
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import {PageHeaderModule} from "./components/page-header/page-header.module";
import { TabsComponent } from './components/tabs/tabs.component';
import { DefaultDialog } from './dialogs/default/default.dialog';
import { DialogHeaderComponent } from './dialogs/components/dialog-header/dialog-header.component';
import { SettingsDialog } from './dialogs/settings/settings.dialog';
import { DialogNavComponent } from './dialogs/components/dialog-nav/dialog-nav.component';
import { DialogButtonsComponent } from './dialogs/components/dialog-buttons/dialog-buttons.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { ContentPage } from './pages/content/content.page';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 150,
  hideDelay: 0,
  touchendHideDelay: 1500,
};


@NgModule({
  declarations: [CoachPortalPage, DashboardPage, TabsComponent, DefaultDialog, DialogHeaderComponent, SettingsDialog, DialogNavComponent, DialogButtonsComponent, ContentPage],
  imports: [
    CommonModule,
    CoachPortalRouting,
    MatIconModule,
    NavItemModule,
    PageHeaderModule,
    MatTooltipModule,
    NgOptimizedImage
  ],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class CoachPortalModule { }