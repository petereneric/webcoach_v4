import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Alert} from "../../../../../utils/alert";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Communication} from "../../../../../services/communication/communication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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

  constructor(private svCommunication: Communication, private activatedRoute: ActivatedRoute, private router: Router, private connApi: ConnApiService, private alert: Alert, public formBuilder: FormBuilder) {
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
      this.alert.invalid()
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
          this.router.navigate(['/webinar/' + this.kWebinar])
        } else {
          this.router.navigate(['/home']);
        }

      }, error: error => {
        console.log(error)
        if (error.status == 401) {
          this.alert.invalidInput('E-Mail unbekannt');
        }
        if (error.status == 403) {
          this.alert.invalidInput('Passwort falsch');
        }
      }
    })
  }

  get errorControl() {
    return this.form.controls
  }
}
