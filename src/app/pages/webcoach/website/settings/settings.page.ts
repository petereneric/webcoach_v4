import { Component, OnInit } from '@angular/core';
import videojs from "video.js";
import {MenuItem} from "../../../../interfaces/menu-item";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  // menu
  lMenu: MenuItem[] = [
    {kIndex: 0, cName: 'Kontosicherheit', cRoute: '/kontoeinstellungen/kontosicherheit', bSelected: true},
    {kIndex: 1, cName: 'Adresse', cRoute: '/kontoeinstellungen//adresse', bSelected: false},
  ]

  constructor() { }

  ngOnInit() {
  }

}
