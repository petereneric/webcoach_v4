import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Currency {

  euro(number: number) {
    return number.toFixed(2).toString().replace(".", ",") + " €"
  }

}
