import {ElementRef, Injectable, QueryList, Renderer2} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AnimationService} from "../animation.service";

@Injectable({
  providedIn: 'root'
})
export class MainMenuService {

  bsIndexMainMenu: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null)

  vMenu: QueryList<any> = new QueryList<any>()

  constructor(private svAnimation: AnimationService, private renderer: Renderer2) {
  }

  set viewMenu(vMenu: QueryList<any>) {
    this.vMenu = vMenu
  }

  style(indexMainMenu) {
    this.vMenu.forEach((element, index) => {
      if (index == indexMainMenu) {
        this.renderer.setStyle(this.getIcon(element), 'color', '#f4f2f5')
        this.renderer.setStyle(this.getTitle(element), 'color', '#f4f2f5')
        this.svAnimation.pump(element)

      } else {
        this.renderer.setStyle(this.getIcon(element), 'color', '#696669')
        this.renderer.setStyle(this.getTitle(element), 'color', '#696669')
      }
    })
  }

  getIcon(element) {
    const container = element.nativeElement
    const children = container.children
    const child = children[0].children
    return child[0] // icon
  }

  getTitle(element) {
    const container = element.nativeElement
    const children = container.children
    const child = children[0].children
    return child[1] // title
  }
}
