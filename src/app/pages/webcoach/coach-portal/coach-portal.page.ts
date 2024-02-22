import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavItem} from "./components/nav-item/nav-item.interface";
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialog} from "./dialogs/settings/settings.dialog";
import {AnimationService} from "../../../services/animation.service";
import {NavigationEnd, Router} from "@angular/router";
import {CoachPortalService} from "./coach-portal.service";
import {ApiService} from "../../../services/api/api.service";
import {Coach} from "../../../interfaces/coach";
import {File} from "../../../utils/file";


@Component({
  selector: 'app-coach-portal',
  templateUrl: './coach-portal.page.html',
  styleUrls: ['./coach-portal.page.sass']
})

export class CoachPortalPage implements OnInit, AfterViewInit {

  @ViewChild('vNav') vNav!: ElementRef
  @ViewChild('vNavOneTitle') vNavOneTitle!: ElementRef
  @ViewChild('vProfileMenu') vProfileMenu!: ElementRef
  @ViewChild('vHeaderProfileImage') vHeaderProfileImage!: ElementRef
  @ViewChild('vIconMenu', {read: ElementRef}) vIconMenu!: ElementRef
  @ViewChild('vIconHelp', {read: ElementRef}) vIconHelp!: ElementRef
  @ViewChild('vNavOne') vNavOne!: ElementRef
  @ViewChild('vNavTwo') vNavTwo!: ElementRef
  @ViewChild('vLoad') vLoad!: ElementRef
  @ViewChild('vNavTwoTitle') vNavTwoTitle!: ElementRef
  @ViewChild('vNavTwoImage') vNavTwoImage!: ElementRef
  @ViewChild('vButtonWebinarStatus') vButtonWebinarStatus!: ElementRef
  @ViewChild('vClickScreen') vClickScreen!: ElementRef

  private readonly MS_NAV_ANIMATION: number = 350

  protected bNavExpanded: boolean = true
  public wNavExpanded: string = '16rem'
  public wNavExpandedNumber: number = 16
  public wNavCollapsed: string = '5rem'
  protected hNavTwoImage: number = 10 // rem
  protected aCoach: Coach | null = null

  readonly ID_NAV_ITEM_SETTINGS = -1
  readonly ID_NAV_ITEM_FEEDBACK = -2
  readonly ID_NAV_DASHBOARD = 1
  readonly ID_NAV_CONTENT = 2

  // navigation main
  protected lNavItemsMain: NavItem[] = [
    {id: this.ID_NAV_DASHBOARD, cIcon: 'dashboard', cTitle: 'Dashboard', cLink: '/coach-portal/dashboard'},
    {id: this.ID_NAV_CONTENT, cIcon: 'smart_display', cTitle: 'Inhalte', cLink: '/coach-portal/inhalte'},
  ]
  protected aSelectedNavItemMain: NavItem = this.lNavItemsMain[0]

  // navigation webinar
  protected lNavItemsWebinar: NavItem[] = [
    {id: this.ID_NAV_ITEM_SETTINGS, cIcon: 'edit', cTitle: 'Details', cLink: '/details'},
    {id: this.ID_NAV_ITEM_FEEDBACK, cIcon: 'video_settings', cTitle: 'Medien', cLink: '/medien'},
  ]
  protected aSelectedNavItemWebinar: NavItem = this.lNavItemsWebinar[0]

  // navigation bottom
  protected lNavItemsBottom: NavItem[] = [
    {id: -1, cIcon: 'settings', cTitle: 'Einstellungen', cLink: null},
    {id: -2, cIcon: 'feedback', cTitle: 'Feedback senden', cLink: null},
  ]

  // navigation profile
  readonly ID_NAV_PROFILE_WEBSITE = 1
  readonly ID_NAV_PROFILE_LOGOUT = 2
  protected lNavItemsProfileMenu: NavItem[] = [
    {id: this.ID_NAV_PROFILE_WEBSITE, cIcon: 'smartphone', cTitle: 'Website', cLink: null},
    {id: this.ID_NAV_PROFILE_LOGOUT, cIcon: 'logout', cTitle: 'Abmelden', cLink: null},
  ]

  constructor(protected uFile: File, private svApi: ApiService, protected svCoachPortal: CoachPortalService, private router: Router, private svAnimation: AnimationService, private renderer: Renderer2, private dialogSettings: MatDialog) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      const routerEvent = event.routerEvent
      if (routerEvent instanceof NavigationEnd) {
        this.selectNavItem(routerEvent.url)
      }
    })

    this.svApi.safeGet('coach-portal/coach', (aCoach: Coach) => {
      console.log(aCoach)
      this.aCoach = aCoach
    })
  }

  ngAfterViewInit(): void {
    // place menu-action profile settings
    this.placeProfileMenu()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.placeProfileMenu()
  }

  placeProfileMenu() {
    const dimenReference = this.vHeaderProfileImage.nativeElement.getBoundingClientRect()
    const dimenTarget = this.vProfileMenu.nativeElement.getBoundingClientRect()
    const pxLeft = dimenReference.x + dimenReference.width - dimenTarget.width + dimenReference.width / 2
    this.renderer.setStyle(this.vProfileMenu.nativeElement, 'left', pxLeft + 'px')
    const pxTop = dimenReference.y + dimenReference.height
    this.renderer.setStyle(this.vProfileMenu.nativeElement, 'top', pxTop + 'px')
  }


  onClick_Menu() {
    this.svAnimation.iconClickTwo(this.vIconMenu)

    if (this.bNavExpanded) {
      // nav
      this.renderer.setStyle(this.vNav.nativeElement, 'transition', this.MS_NAV_ANIMATION + 'ms linear')
      this.renderer.setStyle(this.vNav.nativeElement, 'width', this.wNavCollapsed)
      // nav-one
      this.renderer.setStyle(this.vNavOneTitle.nativeElement, 'display', 'none')
      // nav-two
      this.renderer.setStyle(this.vNavTwoTitle.nativeElement, 'display', 'none')
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'transition', this.MS_NAV_ANIMATION + 'ms linear')
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'height', 5 + 'rem')
    } else {
      // nav
      this.renderer.setStyle(this.vNav.nativeElement, 'transition', this.MS_NAV_ANIMATION + 'ms linear')
      this.renderer.setStyle(this.vNav.nativeElement, 'width', this.wNavExpanded)
      // nav-one
      this.renderer.setStyle(this.vNavOneTitle.nativeElement, 'display', 'flex')
      // nav-two
      this.renderer.setStyle(this.vNavTwoTitle.nativeElement, 'display', 'flex')
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'transition', this.MS_NAV_ANIMATION + 'ms linear')
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'height', this.hNavTwoImage + 'rem')
    }
    this.bNavExpanded = !this.bNavExpanded
  }

  onClick_WebcoachIcon() {
    this.router.navigate(['/coach-portal'])
  }

  onClick_NavItemMain(aNavItem: NavItem) {
    switch (aNavItem.id) {
      case this.ID_NAV_ITEM_SETTINGS:
        const dialogSettings = this.dialogSettings.open(SettingsDialog, {
          backdropClass: "d-backdrop",
        })
        break
      default:
        this.aSelectedNavItemMain = aNavItem
        aNavItem.cLink && this.router.navigate([aNavItem.cLink])
    }
  }

  onClick_NavItemWebinar(aNavItem: NavItem) {
    aNavItem.cLink && this.router.navigate(['coach-portal/webinar/' + this.router.url.split('/')[3] + aNavItem.cLink])
    this.aSelectedNavItemWebinar = aNavItem
  }

  onClick_NavItemProfileSettings(aNavItem: NavItem) {
    switch (aNavItem.id) {
      case this.ID_NAV_PROFILE_WEBSITE:
        this.router.navigate([''])
        break
      case this.ID_NAV_PROFILE_LOGOUT:
        localStorage.setItem('token', '')
        this.router.navigate([''])
        break
    }
  }

  startLoadAnimation() {
    this.renderer.setStyle(this.vLoad.nativeElement, 'display', 'block')
  }

  stopLoadAnimation() {
    this.renderer.setStyle(this.vLoad.nativeElement, 'display', 'none')
  }

  onClick_Help() {
    this.svAnimation.iconClickTwo(this.vIconHelp)
  }

  onClick_BackNavTwo() {
    this.showNavMain()
    this.router.navigate([this.aSelectedNavItemMain.cLink])

  }

  showNavWebinar() {
    this.renderer.setStyle(this.vNavOne.nativeElement, "display", 'none')
    this.renderer.setStyle(this.vNavTwo.nativeElement, "display", 'flex')
  }

  showNavMain() {
    this.renderer.setStyle(this.vNavTwo.nativeElement, "display", 'none')
    this.renderer.setStyle(this.vNavOne.nativeElement, "display", 'flex')

  }

  selectNavItem(url: string) {
    // check nav main
    const lUrlCheckMain = url.split('/', 3)
    const urlCheckMain = lUrlCheckMain.join('/')
    const index = this.lNavItemsMain.findIndex(aNavItem => aNavItem.cLink === urlCheckMain)
    if (index >= 0) this.aSelectedNavItemMain = this.lNavItemsMain[index]

    // check nav webinar
    if (url.includes('webinar') && url.split('/').length > 2) {
      const lUrlCheckWebinar = url.split('/')
      const urlCheckWebinar = lUrlCheckWebinar[4]
      const index = this.lNavItemsWebinar.findIndex(aNavItem => aNavItem.cLink === ('/' + urlCheckWebinar))
      if (index >= 0) {
        this.showNavWebinar()
        this.aSelectedNavItemWebinar = this.lNavItemsWebinar[index]
      }
    }
  }

  onClick_PublishWebinar() {
    this.svApi.safePost('coach-portal/webinar/publish/' + this.svCoachPortal.bsWebinar.value!.id, null, () => {
      console.log("jooooo")
      this.svCoachPortal.bsWebinar.value!.tStatus = 1
    })
  }

  showProfileMenu() {
    this.renderer.setStyle(this.vProfileMenu.nativeElement, 'visibility', 'visible')
  }

  hideProfileMenu() {
    this.renderer.setStyle(this.vProfileMenu.nativeElement, 'visibility', 'hidden')
  }

  onClick_ProfileMenu() {
    if (this.vProfileMenu.nativeElement.style.visibility === 'hidden') {
      this.showProfileMenu()
      this.showClickScreen()
    } else {
      this.hideProfileMenu()
      this.hideClickScreen()
    }
  }

  showClickScreen() {
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'visibility', 'visible')
  }

  hideClickScreen() {
    this.renderer.setStyle(this.vClickScreen.nativeElement, 'visibility', 'hidden')
  }

  onClick_ClickScreen() {
    this.hideProfileMenu()
    this.hideClickScreen()
  }
}
