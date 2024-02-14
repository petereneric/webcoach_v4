import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavItem} from "./nav-item.interface";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.sass']
})
export class NavItemComponent {

  @Input('aNavItem') aNavItem!: NavItem
  @Input('wNavCollapsed') wNavCollapsed!: string
  @Input('kSelected') kSelected!: number

  @Output() outputClick: EventEmitter<NavItem> = new EventEmitter<NavItem>()

  get isSelected() {
    return this.aNavItem.id === this.kSelected
  }

  onClick() {
    this.outputClick.emit(this.aNavItem)
  }
}
