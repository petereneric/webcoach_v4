import {Injectable} from "@angular/core";
// @ts-ignore
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class Role {

  constructor() {
  }

  isCoach() {
    let tokenInfo: any = jwt_decode(localStorage.getItem('token')!);
    let tRole = tokenInfo['tRole'];
    return tRole == 1
  }
}
