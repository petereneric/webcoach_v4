import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavItem} from "../../../components/nav-item/nav-item.interface";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dialog-nav',
  templateUrl: './dialog-nav.component.html',
  styleUrls: ['./dialog-nav.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class DialogNavComponent implements OnInit {

  @Input('lNavItems') lNavItems: NavItem[] = []


  @Output() outputClick: EventEmitter<NavItem> = new EventEmitter<NavItem>()

  protected aNavItemSelected!: NavItem

  ngOnInit(): void {
    this.aNavItemSelected = this.lNavItems[0]
    this.onSelect(this.aNavItemSelected)
  }


  onSelect(aNavItem: NavItem) {
    this.aNavItemSelected = aNavItem
    this.outputClick.emit(aNavItem)
  }
}
