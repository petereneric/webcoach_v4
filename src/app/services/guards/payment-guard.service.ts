import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ConnApiService} from "../conn-api/conn-api.service";
import {Webinar} from "../../interfaces/webinar";
//import {create} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard {

  constructor(private connApi: ConnApiService, private router: Router) { }

  canActivate(route: any): Promise<boolean> {
    return new Promise((resolve) => {
      let kWebinar = 0

      if (route.paramMap.has('kWebinar')) {
        kWebinar = route.paramMap.get('kWebinar')

        this.connApi.get('webinar/' + kWebinar, (webinar: Webinar) => {
          if (webinar.sNet === 0) {
            resolve(true)
          } else {
            this.connApi.safeGet('webinar/auth/webinar-player/' + kWebinar, (response: any) => {
              let webinarPlayer = response

              if (webinarPlayer === null) {
                this.connApi.safePut('webinar/auth/webinar-player/' + kWebinar, null,(response: any) => {
                  webinarPlayer = response
                  this.createPayment(webinarPlayer.id, webinar.id)
                })
              } else {
                if (!webinarPlayer.bAccess) {
                  if (webinarPlayer.urlCheckout === '') {
                    this.createPayment(webinarPlayer.id, webinar.id)
                  } else {
                    window.open(webinarPlayer.urlCheckout, "_blank");
                  }
                } else {
                  console.log("resolve true")
                  resolve(true)
                }
              }

            })
          }
        })


      }
    })
  }

  createPayment(kWebinarPlayer: number, kWebinar: number) {
    let data = {
      kWebinar: kWebinar,
      kWebinarPlayer: kWebinarPlayer,
      tMode: 'test',
    }
    this.connApi.safePut('purchase/webinar', data, (response: any) => {
      window.open(response.urlCheckout, "_blank");
    })
  }
}
