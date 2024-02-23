import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../../../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Communication} from "../../../../../services/communication/communication.service";
import {DialogService} from "../../../../../services/dialogs/dialog.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.sass'],
})
export class LoginPage implements OnInit {

  // variables
  bSubmitted = false

  // data
  kWebinar: number = 0

  // form
  form = this.formBuilder.group({
    cEmail: ['', [Validators.required]],
    cPassword: ['', [Validators.required]],
  })

  constructor(private svDialog: DialogService, private svCommunication: Communication, private activatedRoute: ActivatedRoute, private router: Router, private connApi: ApiService, public formBuilder: FormBuilder) {
  }

  ngOnInit() {


    this.activatedRoute.params.subscribe(params => {
      this.kWebinar = params['kWebinar']
    })
  }

  login() {
    // bSubmitted
    this.bSubmitted = true

    // check
    if (!this.form.valid) {
      this.svDialog.invalidInput()
      return
    }

    // data
    let data = {
      cUser: this.form.get('cEmail')!.value,
      cPassword: this.form.get('cPassword')!.value,
    }

    // api
    this.connApi.longPost('login', data).subscribe({
      next: response => {
        // token
        localStorage.setItem('token', response.headers.get('authorization')!);
        this.svCommunication.token.next(response.headers.get('authorization')!)

        // navigate
        if (this.kWebinar > 0) {
          this.router.navigate(['/webinar-vert/' + this.kWebinar])
        } else {
          this.router.navigate(['/home']);
        }

      }, error: error => {
        console.log(error)
        if (error.status == 401) {
          this.svDialog.unknownEmail()
        }
        if (error.status == 403) {
          this.svDialog.wrongPassword()
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
