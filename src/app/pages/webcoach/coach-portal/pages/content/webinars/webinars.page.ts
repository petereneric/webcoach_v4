import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";
import {Router} from "@angular/router";
import {Webinar} from "../../../../../../interfaces/webinar";
import {File} from "../../../../../../utils/file";
import {DateTime} from "../../../../../../utils/date-time";

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.page.html',
  styleUrls: ['./webinars.page.sass'],
  providers: [File, DateTime]
})
export class WebinarsPage implements OnInit {

  protected lWebinars: Webinar[] = []
  protected lColumns = [{cName: 'Webinar', pWidth: 40+'%'}, {cName: 'Datum', pWidth: 15+'%'}, {cName: 'Aufrufe', pWidth: 15+'%'}, {cName: 'Kommentare', pWidth: 15+'%'}, {cName: 'Daumen hoch', pWidth: 15+'%'}]

  constructor(protected uDateTime: DateTime, protected uFile: File, protected router: Router, private svApi: ApiService) {
  }

  ngOnInit(): void {
    this.svApi.safeGet('coach-portal/content/webinars', (lWebinars: Webinar[]) => {
      this.lWebinars = lWebinars
      console.log(this.lWebinars)
    })
  }


  onClick_Webinar(aWebinar: Webinar) {
    this.router.navigate(['coach-portal/webinar/' + aWebinar.id + '/details'])

  }
}
