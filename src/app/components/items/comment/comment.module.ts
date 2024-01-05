import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommentComponent} from "./comment.component";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [CommentComponent],
    imports: [
        CommonModule,
        MatIconModule
    ],
  exports: [CommentComponent]
})
export class CommentModule { }
