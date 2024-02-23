import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../../../../services/api/api.service";
import {Webinar} from "../../../../../../interfaces/webinar";
import {InputComponent} from "../../../components/input/input.component";
import {CoachPortalService} from "../../../coach-portal.service";
import {DialogService} from "../../../../../../services/dialogs/dialog.service";

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
  protected nChangeCounter: number = 0

  constructor(private svDialog: DialogService, protected svCoachPortal: CoachPortalService, private svApi: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
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
    if (!this.validationCheck()) {
      this.svDialog.invalidInput()
      return
    }


    const data = {
      cName: this.cpInputName.cValue,
      cDescriptionShort: this.cpInputDescriptionShort.cValue,
      cDescriptionLong: this.cpDescriptionLong.cValue,
      cStudyContent: this.cpStudyContent.cValue,
      cRequirements: this.cpRequirements.cValue,
      cTargetGroup: this.cpTargetGroup.cValue,
    }
    this.svApi.safePost('coach-portal/webinar/details/' + this.svCoachPortal.bsWebinar.value?.id, data, () => {
      this.reset()
    })
  }

  validationCheck() {
    if (!this.cpInputName.isValid) return false
    if (!this.cpInputDescriptionShort.isValid) return false
    if (!this.cpDescriptionLong.isValid) return false
    if (!this.cpStudyContent.isValid) return false
    if (!this.cpRequirements.isValid) return false
    if (!this.cpTargetGroup.isValid) return false
    return true
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
