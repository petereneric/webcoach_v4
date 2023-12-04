import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ConnApiService} from "../../../../../services/conn-api/conn-api.service";
import {Alert} from "../../../../../utils/alert";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-request',
  templateUrl: './password-request.page.html',
  styleUrls: ['./password-request.page.scss'],
  providers: [Alert]
})
export class PasswordRequestPage implements OnInit {

  // variables
  bSubmitted: boolean = false

  // form
  form = this.formBuilder.group({
    cEmail: ['', Validators.required]
  })

  constructor(private router: Router, private alert: Alert, private connApi: ConnApiService, private formBuilder: FormBuilder) {
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
        this.alert.checkEmail()
      }, error: error => {
        console.log(error);
        if (error.status == 400) {
          this.alert.unknownEmail()
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
