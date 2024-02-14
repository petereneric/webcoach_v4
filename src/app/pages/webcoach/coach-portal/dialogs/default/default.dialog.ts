import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-default',
  templateUrl: './default.dialog.html',
  styleUrls: ['./default.dialog.sass'],
})
export class DefaultDialog implements OnInit {

  constructor(public dialog: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }
}
