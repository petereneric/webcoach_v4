import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
})
export class PortalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeMenu() {
  }

  menuEvent($event: string) {
    switch ($event) {
      case 'side-menu':
        console.log('open menu')
    }
  }

}
