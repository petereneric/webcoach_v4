import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MenuItem} from "../../../interfaces/menu-item";

@Component({
  selector: 'app-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
})
export class MenuHorizontalComponent  implements OnInit {

  @Input() lMenu: MenuItem[] = []

  constructor(private router: Router) { }

  ngOnInit() {}

  // click menuItem
  onSelect(item: MenuItem) {
    // update selector
    this.lMenu.forEach(item_ => {
        item_.bSelected = item_.kIndex === item.kIndex
    })
    // navigate to route
    this.router.navigate([item.cRoute])
  }

}
