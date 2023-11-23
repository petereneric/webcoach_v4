import { NgModule } from '@angular/core';
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
import {ListDirective} from "./directives/list.directive";
import {environment} from "../environments/environment";


export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: {direction: Hammer.DIRECTION_ALL},
    pan: {direction: Hammer.DIRECTION_ALL, threshold: environment.THRESHOLD_PAN},
    press: {time: 1},
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HammerModule, MatFormFieldModule, MatMenuModule, MatToolbarModule, MatButtonModule, BrowserAnimationsModule, MatDialogModule, VjsPlayerModule, HttpClientModule
  ],
  providers: [DatePipe, {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
