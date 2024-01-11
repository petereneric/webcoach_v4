import {NgModule, Renderer2} from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule  } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {VjsPlayerModule} from "./components/vjs-player/vjs-player.module";
import {HttpClientModule} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {environment} from "../environments/environment";
import {MatIconModule} from "@angular/material/icon";
import { MenuDirective } from './directives/menu.directive';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';


export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: {direction: Hammer.DIRECTION_ALL},
    pan: {direction: Hammer.DIRECTION_ALL, threshold: environment.THRESHOLD_PAN},
    press: {time: 100},
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MenuDirective,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule, HammerModule, MatFormFieldModule, MatMenuModule, MatToolbarModule, MatButtonModule, BrowserAnimationsModule, MatDialogModule, VjsPlayerModule, HttpClientModule, MatIconModule
    ],
  providers: [DatePipe, {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
