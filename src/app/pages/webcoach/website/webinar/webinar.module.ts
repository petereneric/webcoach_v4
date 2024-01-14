import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {WebinarPageRoutingModule} from './webinar-routing.module';

import {WebinarPage} from './webinar.page';
import {VjsPlayerModule} from "../../../../components/vjs-player/vjs-player.module";
import {MatIconModule} from "@angular/material/icon";
import {ItemSectionModule} from "../../../../components/webinar/item-section/item-section.module";
import {ListSliderModule} from "../../../../components/list-slider/list-slider.module";
import {NoteUnitModule} from "../../../../components/items/note/note-unit/note-unit.module";
import {ListActionModule} from "../../../../components/list-action/list-action.module";
import {ListActionItemModule} from "../../../../components/items/list-action-item/list-action-item.module";
import {ListInputModule} from "../../../../components/list-input/list-input.module";
import {CommentModule} from "../../../../components/items/comment/comment.module";
import {CommentPipe} from "../../../../pipes/comment.pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebinarPageRoutingModule,
        VjsPlayerModule,
        MatIconModule,
        ItemSectionModule,
        NgOptimizedImage,
        ListSliderModule,
        NoteUnitModule,
        ListActionModule,
        ListActionItemModule,
        ReactiveFormsModule,
        ListInputModule,
        CommentModule,
        CommentPipe,
    ],
  declarations: [WebinarPage]
})
export class WebinarPageModule {
}
