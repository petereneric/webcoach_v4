import {AfterViewInit, Component, ElementRef, Input, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {Tab} from "./tab.interface";
import {AnimationService} from "../../../../../services/animation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass']
})


export class TabsComponent implements AfterViewInit {

  @ViewChild('vBar') vBar!: ElementRef
  @ViewChild('vContainer') vContainer!: ElementRef
  @ViewChildren("vTabs") vTabs!: QueryList<ElementRef>;

  @Input('lTabs') lTabs: Tab[] = []

  private dimenContainer

  constructor(private router: Router, private svAnimation: AnimationService, private renderer: Renderer2) {
  }



  ngAfterViewInit(): void {
    this.dimenContainer = this.vContainer.nativeElement.getBoundingClientRect()
    this.select(null, this.lTabs[0], 0)
  }

  select($event: any | null, aTab: Tab, secTransition = 0.25) {
    this.vTabs.forEach(vTab => {
      if (aTab.id == vTab.nativeElement.firstChild.id as Number) {
        const dimenTab = vTab.nativeElement.getBoundingClientRect()
        this.svAnimation.moveHorizontal(this.vBar, dimenTab.x - this.dimenContainer.x, secTransition)
        this.renderer.setStyle(this.vBar.nativeElement, 'width', dimenTab.width + 'px')
        this.router.navigate(['' + aTab.cPath])

        if ($event) {
          this.svAnimation.ripple(vTab.nativeElement.firstChild.lastChild, vTab.nativeElement.firstChild, $event)
        }
      }

    })
  }

}
