import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../../../../services/api/api.service";
import {Router} from "@angular/router";
import {DialogService} from "../../../../../services/dialogs/dialog.service";

@Component({
  selector: 'app-password-request',
  templateUrl: './password-request.page.html',
  styleUrls: ['./password-request.page.sass'],
})
export class PasswordRequestPage implements OnInit {

  // variables
  bSubmitted: boolean = false

  // form
  form = this.formBuilder.group({
    cEmail: ['', Validators.required]
  })

  constructor(private svDialog: DialogService, private router: Router, private connApi: ApiService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.bSubmitted = true

    // check
    if (!this.form.valid) return

    // data
    let data = {
      cEmail: this.form.get('cEmail')?.value
    }

    // api
    this.connApi.longPost('password-request', data).subscribe({
      next: (data: any) => {
        this.svDialog.checkEmail()
      }, error: error => {
        console.log(error);
        if (error.status == 400) {
          this.svDialog.unknownEmail()
        }
      }
    })
  }


  get errorControl() {
    return this.form.controls
  }

  onBack() {
    this.router.navigate(['/konto'])
  }
}
