import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
//import {MenuController} from "@ionic/angular";
import {AuthApiService} from "../../../services/api/auth-api.service";
import {Communication} from "../../../services/communication/communication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MainMenuService} from "../../../services/menu/main-menu.service";

@Component({
  selector: 'app-website',
  templateUrl: './website.page.html',
  styleUrls: ['./website.page.scss'],
  providers: [MainMenuService]
})
export class WebsitePage implements OnInit, AfterViewInit{

  // ViewChild
  @ViewChildren('vMenuTabs') vMenuTabs!: QueryList<any>;

  // tabs
  lMenu = [
    {index: 0, cTitle: 'Start', cIcon: 'home', cLink: 'start'},
    {index: 1, cTitle: 'Suchen', cIcon: 'search', cLink: 'suchen'},
    {index: 2, cTitle: 'Buchungen', cIcon: 'play_circle_filled', cLink: 'buchungen'},
    {index: 3, cTitle: 'Merkliste', cIcon: 'favorite_border', cLink: 'merkliste'},
    {index: 4, cTitle: 'Konto', cIcon: 'account_circle', cLink: 'konto'}
  ]

  constructor(private activatedRoute: ActivatedRoute, private svMenu: MainMenuService, private router: Router, private authApi: AuthApiService, private svCommunication: Communication) {
  }

  ngOnInit() {

    // set token in communication service
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      this.svCommunication.token.next(null)
    } else {
      this.authApi.authenticate().subscribe({
        next: (response: any) => {
          this.svCommunication.token.next(response.headers.get('authorization'))
        }, error: error => {
          console.log(error)
          this.svCommunication.token.next(null)
        }
      })
    }



  }


  menuEvent($event: string) {

  }

  onMenu(aMenuTab) {
    this.router.navigate([aMenuTab.cLink])
    this.svMenu.bsIndexMainMenu.next(aMenuTab.index)

  }

  ngAfterViewInit(): void {
    // menu
    this.svMenu.viewMenu = this.vMenuTabs
    this.svMenu.bsIndexMainMenu.subscribe(indexMainMenu => {
      console.log(indexMainMenu)
      this.svMenu.style(indexMainMenu)
    })

    this.lMenu.forEach(aMenu => {
      console.log(this.router.url)
      console.log(aMenu.cLink)
      if (aMenu.cLink === this.router.url.replace('/', '')) this.svMenu.bsIndexMainMenu.next(aMenu.index)
    })
  }
}
