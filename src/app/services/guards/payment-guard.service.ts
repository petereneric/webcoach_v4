import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api/api.service";
import {Webinar} from "../../interfaces/webinar";
//import {create} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard {

  constructor(private connApi: ApiService, private router: Router) { }

  canActivate(route: any): Promise<boolean> {
    console.log("Payment Guard")
    console.log("joo")
    return new Promise((resolve) => {
      let kWebinar = 0

      if (route.paramMap.has('kWebinar')) {
        kWebinar = route.paramMap.get('kWebinar')

        this.connApi.get('webinar/' + kWebinar, (webinar: Webinar) => {
          if (webinar.sNet === 0) {
            // webinar is free
            resolve(true)
          } else {
            // webinar is not free

            // get webinar-player
            this.connApi.safeGet('webinar/auth/webinar-player/' + kWebinar, (response: any) => {
              let webinarPlayer = response

              if (webinarPlayer === null) {
                // create webinar-player
                this.connApi.safePut('webinar/auth/webinar-player/' + kWebinar, null,(response: any) => {
                  webinarPlayer = response
                  console.log("HEEEEJO")
                  // add webinar-player to cart
                  this.addToCart(webinar.id)
                  //sresolve(false)
                })
              } else {
                if (!webinarPlayer.bAccess) {
                  // no access --> add to cart
                  console.log("JOOOOOOJK")
                  this.addToCart(webinar.id)
                  //resolve(false)
                } else {
                  console.log("FALLSE")
                  // access --> player can be handled to webinar-vert
                  resolve(true)
                }
              }
            })
          }
        })
      }
    })
  }

  addToCart(kWebinar: number) {
    console.log("WHHHYY")
    this.router.navigate(['checkout/' + kWebinar])
    /*
    this.connApi.safePut('cart/' + kWebinar, null, (response: any) => {

    })
     */
  }
}
