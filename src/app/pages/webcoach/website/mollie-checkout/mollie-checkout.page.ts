import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mollie-checkout',
  templateUrl: './mollie-checkout.page.html',
  styleUrls: ['./mollie-checkout.page.sass']
})
export class MollieCheckoutPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const token = params['token']
      console.log('https://www.mollie.com/checkout/select-method/' + token)
      window.open('https://www.mollie.com/checkout/select-method/' + token, '_self')
    })
  }



}
