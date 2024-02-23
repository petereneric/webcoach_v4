import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-invalid',
  templateUrl: './invalid.page.html',
  styleUrls: ['./invalid.page.sass'],
})
export class InvalidPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
