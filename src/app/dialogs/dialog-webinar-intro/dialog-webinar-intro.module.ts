import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogWebinarIntroComponent} from "./dialog-webinar-intro.component";
import {VjsPlayerModule} from "../../components/vjs-player/vjs-player.module";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [DialogWebinarIntroComponent],
    imports: [
        CommonModule,
        VjsPlayerModule,
        MatIconModule
    ]
})
export class DialogWebinarIntroModule { }
