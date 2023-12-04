import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoDialog} from "./video.dialog";
import {MatIconModule} from "@angular/material/icon";
import {VjsPlayerModule} from "../../components/vjs-player/vjs-player.module";



@NgModule({
  declarations: [VideoDialog],
  imports: [
    CommonModule,
    MatIconModule,
    VjsPlayerModule
  ],
  exports: []
})
export class VideoModule { }
