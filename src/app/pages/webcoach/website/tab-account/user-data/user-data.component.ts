import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormBuilder, Validators} from "@angular/forms";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Player} from "../../../../../interfaces/player";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.sass']
})
export class UserDataComponent implements OnInit {

  // form
  form = this.formBuilder.group({
    cName: ['', [Validators.required]],
    cPrename: ['', ],
    cSurname: ['', ],
    cStreet: ['', ],
    cStreetNumber: ['', ],
    cCity: ['', ],
    cZip: ['', ],
  })

  // data
  aPlayer: Player | null = null

  constructor(private location: Location, private api: ConnApiService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.api.safeGet('player/user-data', aPlayer => {
      this.aPlayer = aPlayer
      this.fill(this.aPlayer!)
    })
  }

  fill(aPlayer: Player) {
    this.form.controls['cName'].setValue(aPlayer.cName)
    this.form.controls['cPrename'].setValue(aPlayer.cPrename)
    this.form.controls['cSurname'].setValue(aPlayer.cSurname)
    this.form.controls['cStreet'].setValue(aPlayer.cStreet)
    this.form.controls['cStreetNumber'].setValue(aPlayer.cStreetNumber)
    this.form.controls['cCity'].setValue(aPlayer.cCity)
    this.form.controls['cZip'].setValue(aPlayer.cZip)
  }

  save() {
    const data = {
      cName: this.form.get('cName')?.value,
      cPrename: this.form.get('cPrename')?.value,
      cSurname: this.form.get('cSurname')?.value,
      cStreet: this.form.get('cStreet')?.value,
      cStreetNumber: this.form.get('cStreetNumber')?.value,
      cCity: this.form.get('cCity')?.value,
      cZip: this.form.get('cZip')?.value,
    }

    this.api.safePost('player/user-data', data, () => {})
  }


  onBack() {
    this.save()
  }
}
