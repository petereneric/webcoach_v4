import {Component, OnInit} from '@angular/core';
import {DefaultDialog} from "../../../../dialogs/default/default.dialog";

@Component({
  selector: 'app-section',
  templateUrl: './section.dialog.html',
  styleUrls: ['./section.dialog.sass']
})
export class SectionDialog extends DefaultDialog implements OnInit {

}
