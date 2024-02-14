import { Component } from '@angular/core';
import {Tab} from "../../components/tabs/tab.interface";

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.sass']
})
export class ContentPage {

  protected lTabs: Tab[] = [{id: 1, cTitle: 'Online-Kurse', cPath: 'coach-portal/inhalte/online-kurse'}]
}
