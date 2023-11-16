import { Injectable } from '@angular/core';
import {ConnApiService} from "../conn-api/conn-api.service";
import {RoleService} from "../authentication/role.service";
import {Webinar} from "../../interfaces/webinar";
import {Router} from "@angular/router";

/*
This service checks if there exists already a webinarPlayer instance in the database and if so if the player has
already access to the webinar or not. If yes lead him directly to the webinar, if not lead him to the intro page by
resolving true.
 */

@Injectable({
  providedIn: 'root'
})
export class WebinarPlayerGuardService {

  constructor(private router: Router, private roleService: RoleService, private connApi: ConnApiService) {}

  canActivate(route: any): Promise<boolean> {
    return new Promise((resolve) => {

      // kWebinar from route
      let kWebinar = route.paramMap.get('id')

      // kPlayer
      let kPlayer = this.roleService.get_kPlayer()

      if (kPlayer > 0) {
        this.connApi.safeGet('webinar/auth/webinar-player/' + kWebinar, (webinarPlayer: any) => {
          if (webinarPlayer === null) {
            console.log("1")
            resolve(true)
          } else {
            if (webinarPlayer.bAccess === 1) {
              this.router.navigate(['/webinar/' + kWebinar])
            } else {
              console.log("2")
              resolve(true)
            }
          }
        })
      } else {
        console.log("3")
        resolve(true)
      }
    })
  }
}
