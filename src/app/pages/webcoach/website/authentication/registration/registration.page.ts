import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Alert} from "../../../../../utils/alert";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Communication} from "../../../../../services/communication/communication.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  providers: [Alert]
})
export class RegistrationPage implements OnInit {

  // variables
  bSubmitted = false
  bShowPassword = false

  // data
  kWebinar: number = 0

  // form
  form = this.formBuilder.group({
    cName: ['', [Validators.required]],
    cEmail: ['', [Validators.required]],
    cPassword: ['', [Validators.required]],
  })

  constructor(private svCommunication: Communication, private activatedRoute: ActivatedRoute, private router: Router, private connApi: ConnApiService, private alert: Alert, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.kWebinar = params['kWebinar']
    })
  }

  register() {
    // bSubmitted
    this.bSubmitted = true

    // check
    if (!this.form.valid) {
      this.alert.invalid()
      return
    }

    // data
    let data = {
      cName: this.form.get('cName')?.value,
      cEmail: this.form.get('cEmail')?.value,
      cPassword: this.form.get('cPassword')?.value,
    }

    // api
    this.connApi.longPost('registration', data).subscribe({
      next: response => {
        if (response.status == 200) {
          // token
          localStorage.setItem('token', response.headers.get('authorization')!);
          this.svCommunication.token.next(response.headers.get('authorization')!)

          // navigate
          if (this.kWebinar > 0) {
            this.router.navigate(['/webinar-vert/' + this.kWebinar])
          } else {
            this.router.navigate(['home']);
          }
        }
      },
      error: error => {
        console.log(error)

        if (error.status == 406) {
          this.alert.invalidInput('Es existiert bereits ein Nutzerkonto mit dieser E-Mail Adresse');
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
