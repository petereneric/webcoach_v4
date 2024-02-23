import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../../../../services/api/api.service";
import {jwtDecode } from 'jwt-decode';
import {Toast} from "../../../../../utils/toast";
import {DialogService} from "../../../../../services/dialogs/dialog.service";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.sass'],
  providers: [Toast]
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

  constructor(private svDialog: DialogService, private toast: Toast, private router: Router, private connApi: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['token'] != null) {
        this.token = params['token'];

        let tokenInfo: any = jwtDecode(this.token);
        let exp = tokenInfo['exp'];
        // Check if token has expired
        if ((Date.now()/1000) > exp) {
          this.svDialog.invalidToken()
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
        this.router.navigate(['login/0'])
      }, error: error => {
        console.log(error)
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
