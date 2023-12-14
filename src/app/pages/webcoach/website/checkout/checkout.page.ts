import {Component, OnInit} from '@angular/core';
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Webinar} from "../../../../interfaces/webinar";
import {Currency} from "../../../../utils/currency";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.sass'],
  providers: [Currency]
})
export class CheckoutPage implements OnInit {

  // data
  aUserData: any | null = null
  cInfoUserData: string = "Um Dir eine Rechnung auf deinen Namen ausstellen zu können, benötigen wir deine Anschrift. Wir bitten Dich daher die untenstehenden Felder auszufüllen."

  // variables
  kWebinar!: number
  aWebinar: Webinar | null = null
  bUserData: boolean = true

  constructor(private router: Router, public uCurrency: Currency, private activatedRoute: ActivatedRoute, private api: ConnApiService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      // load
      this.kWebinar = params['kWebinar']
      console.log("nasdnfk: ", )
      this.api.get('webinar/' + this.kWebinar, data => {
        this.aWebinar = data
        console.log("neeeeeeeeeeee")
        console.log(this.aWebinar)
      })
    })

    this.checkData()



  }


  onForwardUserData() {
    this.checkData()
  }

  checkData() {
    this.api.safeGet('player/user-data', aUserData => {
      this.aUserData = aUserData
      console.log(this.aUserData)

      // check if user data is complete
      let _bUserData = true

      for (const key of Object.keys(aUserData)) {
        if (aUserData[key] === "") {
          _bUserData = false
          break
        }
      }

      this.bUserData = _bUserData
    })
  }

  onBackCart() {
    this.bUserData = false
  }

  onPay() {
    const data = {
      tMode: 'test',
      kWebinar: this.kWebinar,

    }


    //this.router.navigate(['/mollie-checkout/' + 'test'])

    this.api.safePut('purchase/webinar', data, data => {
      console.log(data.urlCheckout)
      let bCut = true
      let urlCheckout = new String(data.urlCheckout)
      while (bCut) {
        let index = urlCheckout.indexOf('/')
        console.log(index)
        if (index >= 0) {
          urlCheckout = urlCheckout.substring(index+1, urlCheckout.length)
        } else {
          bCut = false
        }
      }
      console.log(urlCheckout)
      this.router.navigate(['/mollie-checkout/' + urlCheckout])
    })




  }
}
