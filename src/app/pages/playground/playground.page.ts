import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {interval, Subscription} from "rxjs";
import {CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ViewportRuler} from "@angular/cdk/overlay";

@Component({
  selector: 'app-test-scroll',
  templateUrl: './playground.page.html',
  styleUrls: ['./playgroundl.page.sass'],
})
export class PlaygroundPage implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup) listGroup!: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder!: CdkDropList;

  public target: CdkDropList | null;
  public targetIndex!: number;
  public source: CdkDropList | null;
  public sourceIndex!: number;
  public activeContainer;

  public items: Array<number> = Array(10)
    .fill(0)
    .map((_, i) => i + 1);

  constructor(private viewportRuler: ViewportRuler) {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    console.log(this.items)
  }

  public itemTrackBy(item) {
    return item.id;
  }

  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement!.removeChild(phElement);
  }

  dropListDropped() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent!.removeChild(phElement);
    parent!.appendChild(phElement);
    parent!.insertBefore(
      this.source!.element.nativeElement,
      parent!.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;
    this.activeContainer = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
    }

    console.log(this.items)
  }

  // @ts-ignore
  cdkDropListEntered(e: CdkDragEnter) {
    console.log("cdkDropListEntered")
    const drag = e.item;
    const drop = e.container;

    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    sourceElement.style.backgroundColor = 'red';

    console.log(phElement.getBoundingClientRect());
    console.log(sourceElement.getBoundingClientRect());
    console.log(dropElement.getBoundingClientRect());

    const dragIndex = __indexOf(
      dropElement.parentElement!.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement!.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = dropElement.clientWidth / 2 + 'px';
      phElement.style.height = dropElement.clientHeight + 'px';
      console.log('dCont', sourceElement.clientWidth);
      console.log('ph', phElement.style.width, phElement.style.height);

      sourceElement.parentElement!.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement!.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    requestAnimationFrame(() => {
      this.placeholder._dropListRef.enter(
        drag._dragRef,
        drag.element.nativeElement.offsetLeft,
        drag.element.nativeElement.offsetTop
      );
    });
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}
