import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  providers: []
})
export class CookieBannerComponent  implements OnInit, AfterViewInit {

  // variables
  bCookies: boolean | null = null

  text: string = "Wenn Du auf \"OK\" klickst, stimmst Du der Speicherung von Cookies auf deinem Gerät zu, die zur Verbesserung der Website-Navigation, zur Analyse der Website-Nutzung sowie zur Optimierung unserer Marketingmaßnahmen verwendet werden."

  constructor() { }

  ngOnInit() {
    let bCookies = localStorage.getItem('bCookies');
    if (bCookies != undefined) {
      this.bCookies = bCookies === 'true'
      if (!this.bCookies) {
        //this.cookieService.deleteAll();
      }
    }
  }

  ngAfterViewInit(): void {
  }

  onAccept() {
    this.bCookies = true
    localStorage.setItem('bCookies', 'true')
  }

  onDeny() {
    this.bCookies = false
    localStorage.setItem('bCookies', 'false')
    //this.cookieService.deleteAll();
  }
}
