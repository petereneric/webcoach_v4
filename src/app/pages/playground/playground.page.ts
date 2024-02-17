import {Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {interval, Subscription} from "rxjs";
import {CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-test-scroll',
  templateUrl: './playground.page.html',
  styleUrls: ['./playgroundl.page.scss'],
})
export class PlaygroundPage {


  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }




}
