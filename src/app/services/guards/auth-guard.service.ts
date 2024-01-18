import { Injectable } from '@angular/core';
import {AuthApiService} from "../api/auth-api.service";
import {HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  // data
  kWebinar: number = 0

  constructor(private authApiService: AuthApiService, private router: Router) {  }

  canActivate(r: any): Promise<boolean> {
    return new Promise((resolve) => {
      // kWebinar
      if (r.paramMap.has('kWebinar')) this.kWebinar = r.paramMap.get('kWebinar')

      // check if there is any token yet
      if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {

        // if there is no token set yet navigate user to registration
        this.router.navigate(['registrierung/' + this.kWebinar]);
        resolve(false);

      } else {

        // send token to server and let it be proofed
        this.authApiService.authenticate().subscribe({next: (response: HttpResponse<any>) => {
            // log
            console.log('AuthGuard passed');
            console.log(response.headers.get('authorization'));

            // save new token
            localStorage.setItem('token', response.headers.get('authorization')!);

            // return to router
            resolve(true);

          }, error: error => {
            console.log('AuthGuard not passed');
            console.log(error);

            switch (error.status) {
              case 401:
              case 440:
                this.router.navigate(['login/' + this.kWebinar]);
                break;
              case 412:
                this.router.navigate(['registrierung/verification']);
                break;
            }

            resolve(false);
          }})
      }
    })
  }
}
