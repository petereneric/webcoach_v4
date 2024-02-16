import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../../../../services/api/api.service";
import {Webinar} from "../../../../../../interfaces/webinar";
import {InputComponent} from "../../../components/input/input.component";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.sass']
})
export class DetailsPage implements OnInit {

  @ViewChild('cpInputName') cpInputName!: InputComponent
  @ViewChild('cpInputDescriptionShort') cpInputDescriptionShort!: InputComponent
  @ViewChild('cpDescriptionLong') cpDescriptionLong!: InputComponent
  @ViewChild('cpStudyContent') cpStudyContent!: InputComponent
  @ViewChild('cpRequirements') cpRequirements!: InputComponent
  @ViewChild('cpTargetGroup') cpTargetGroup!: InputComponent

  protected aWebinar: Webinar | null = null
  protected nChangeCounter: number = 0



  constructor(private svApi: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const kWebinar = params['id']

      this.svApi.safeGet('coach-portal/webinar/details/' + kWebinar, (aWebinar: Webinar) => {
        console.log(aWebinar)
        this.aWebinar = aWebinar
      })
    })
  }




  onInput($event) {
    if ($event) {
      this.nChangeCounter++
    } else {
      this.nChangeCounter > 0 && this.nChangeCounter--
    }
    console.log(this.nChangeCounter)
  }

  onClick_Save() {
    console.log("safe")
    const data = {
      cName: this.cpInputName.cValue,
      cDescriptionShort: this.cpInputDescriptionShort.cValue,
      cDescriptionLong: this.cpDescriptionLong.cValue,
      cStudyContent: this.cpStudyContent.cValue,
      cRequirements: this.cpRequirements.cValue,
      cTargetGroup: this.cpTargetGroup.cValue,
    }
    this.svApi.safePost('coach-portal/webinar/details/' + this.aWebinar?.id, data, () => {
      this.reset()
    })
  }

  reset() {
    this.cpInputName.reset()
    this.cpInputDescriptionShort.reset()
    this.cpDescriptionLong.reset()
    this.cpStudyContent.reset()
    this.cpRequirements.reset()
    this.cpTargetGroup.reset()
    this.nChangeCounter = 0
  }
}
