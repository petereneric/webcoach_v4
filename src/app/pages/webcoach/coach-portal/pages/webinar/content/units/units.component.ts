import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Unit} from "../../../../../../../interfaces/unit";
import {CdkDrag, CdkDragEnter, CdkDropList, CdkDropListGroup, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {ViewportRuler} from "@angular/cdk/overlay";

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatIconModule,
    NgForOf
  ],
  templateUrl: './units.component.html',
  styleUrl: './units.component.sass'
})
export class UnitsComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup) listGroup!: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder!: CdkDropList;

  @Input('lUnits') lUnits!: Unit[]

  @Output() outputPositionChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() outputClickUnit: EventEmitter<Unit> = new EventEmitter<Unit>()
  @Output() outputAddUnit: EventEmitter<any> = new EventEmitter<any>()

  public target: CdkDropList | null;
  public targetIndex!: number;
  public source: CdkDropList | null;
  public sourceIndex!: number;
  public activeContainer;

  constructor() {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    console.log(this.lUnits)
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
      moveItemInArray(this.lUnits, this.sourceIndex, this.targetIndex);
    }

    console.log(this.lUnits)
    this.outputPositionChange.emit()
  }

  // @ts-ignore
  cdkDropListEntered(e: CdkDragEnter) {
    console.log("cdkDropListEntered")
    const drag = e.item;
    const drop = e.container;

    if (drop === this.placeholder) {
      console.log("jooo")
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    //sourceElement.style.backgroundColor = 'red';

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

      //phElement.style.backgroundColor = 'green';

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

  onClick_Unit(aUnit: Unit) {
    this.outputClickUnit.emit(aUnit)
  }

  onClick_AddUnit() {
    this.outputAddUnit.emit()
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}
