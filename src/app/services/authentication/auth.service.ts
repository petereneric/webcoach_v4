import { Injectable } from '@angular/core';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn() {
    let token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      return false
    }

    let tokenInfo: any = jwtDecode(token);
    let tsExpiration = tokenInfo['exp'];
    console.log(tsExpiration);
    console.log(new Date().getTime())

    return true
  }
}
