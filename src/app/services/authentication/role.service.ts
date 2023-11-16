import { Injectable } from '@angular/core';
import {jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  isCoach() {
    let token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      return false
    }

    let tokenInfo: any = jwtDecode(token);
    let tRole = tokenInfo['tRole'];

    return tRole >= 1
  }

  isPlayer() {
    let token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      return false
    }

    let tokenInfo: any = jwtDecode(token);
    let tRole = tokenInfo['tRole'];

    return tRole >= 0
  }

  get_kPlayer() {
    if (this.isPlayer()) {
      let token = localStorage.getItem('token')
      let tokenInfo: any = jwtDecode(token!);
      return tokenInfo['kPlayer'];
    }
    return 0
  }
}
