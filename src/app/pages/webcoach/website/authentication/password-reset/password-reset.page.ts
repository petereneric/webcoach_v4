import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Alert} from "../../../../../utils/alert";
import {jwtDecode } from 'jwt-decode';
import {Toast} from "../../../../../utils/toast";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
  providers: [Alert, Toast]
})
export class PasswordResetPage implements OnInit {

  // variables
  bSubmitted: boolean = false

  // data
  token: string = ''

  // form
  form = this.formBuilder.group({
    cPassword: ['', Validators.required]
  })

  constructor(private toast: Toast, private alert: Alert, private router: Router, private connApi: ConnApiService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['token'] != null) {
        this.token = params['token'];

        let tokenInfo: any = jwtDecode(this.token);
        let exp = tokenInfo['exp'];
        // Check if token has expired
        if ((Date.now()/1000) > exp) {
          this.alert.invalidPasswordToken()
        }
      } else {
        this.router.navigate(['app-root']);
      }
    })
  }

  onSubmit() {
    this.bSubmitted = true;

    // check
    if (!this.form.valid) return

    // data
    let data = {
      cPassword: this.form.get('cPassword')?.value,
      token: this.token
    }

    // api
    this.connApi.longPost('password-reset', data).subscribe({
      next: (data: any) => {
        this.toast.saved()
        localStorage.removeItem('token');
        this.router.navigate(['login'])
      }, error: error => {
        console.log(error)
      }
    })
  }

  get errorControl() {
    return this.form.controls
  }
}
