import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Numbers {

  constructor() {
  }

  dotToComma(number: String | null) {
    if (number !== null) {
      return number.replace(".", ",")
    }
    return ""
  }

  euro(number: number) {
    return number.toFixed(2).toString().replace(".", ".") + " €"
  }
}
