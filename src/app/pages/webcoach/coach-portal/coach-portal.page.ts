import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavItem} from "./components/nav-item/nav-item.interface";
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialog} from "./dialogs/settings/settings.dialog";
import {AnimationService} from "../../../services/animation.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-coach-portal',
  templateUrl: './coach-portal.page.html',
  styleUrls: ['./coach-portal.page.sass']
})

export class CoachPortalPage implements OnInit, AfterViewInit {

  @ViewChild('vNav') vNav!: ElementRef
  @ViewChild('vNavOneTitle') vNavOneTitle!: ElementRef
  @ViewChild('vProfileSettings') vProfileSettings!: ElementRef
  @ViewChild('vHeaderProfileImage') vHeaderProfileImage!: ElementRef
  @ViewChild('vIconMenu', { read: ElementRef }) vIconMenu!: ElementRef
  @ViewChild('vIconHelp', { read: ElementRef }) vIconHelp!: ElementRef
  @ViewChild('vNavOne') vNavOne!: ElementRef
  @ViewChild('vNavTwo') vNavTwo!: ElementRef
  @ViewChild('vLoad') vLoad!: ElementRef
  @ViewChild('vNavTwoTitle') vNavTwoTitle!: ElementRef
  @ViewChild('vNavTwoImage') vNavTwoImage!: ElementRef

  private readonly MS_NAV_ANIMATION: number = 350

  protected bNavExpanded: boolean = true
  public wNavExpanded: string = '16rem'
  public wNavExpandedNumber: number = 16
  public wNavCollapsed: string = '5rem'
  protected hNavTwoImage: number = 10 // rem

  readonly ID_NAV_ITEM_SETTINGS = -1
  readonly ID_NAV_ITEM_FEEDBACK = -2
  readonly ID_NAV_DASHBOARD = 1
  readonly ID_NAV_CONTENT = 2

  protected lNavItemsOne: NavItem[] = [
    {id: this.ID_NAV_DASHBOARD, cIcon: 'dashboard', cTitle: 'Dashboard', cLink: 'coach-portal/dashboard'},
    {id: this.ID_NAV_CONTENT, cIcon: 'smart_display', cTitle: 'Inhalte', cLink: 'coach-portal/inhalte'},
  ]

  protected lNavItemsTwo: NavItem[] = [
    {id: this.ID_NAV_ITEM_SETTINGS, cIcon: 'dashboard', cTitle: 'Dashboard', cLink: null},
    {id: this.ID_NAV_ITEM_FEEDBACK, cIcon: 'smart_display', cTitle: 'Inhalte', cLink: null},
  ]

  protected lNavItemsBottom: NavItem[] = [
    {id: -1, cIcon: 'settings', cTitle: 'Einstellungen', cLink: null},
    {id: -2, cIcon: 'feedback', cTitle: 'Feedback senden', cLink: null},
  ]

  protected kSelectedNavItem: number = this.lNavItemsOne[0].id

  protected lNavItemsProfileSettings: NavItem[] = [
    {id: 1, cIcon: 'smartphone', cTitle: 'Website', cLink: null},
    {id: 2, cIcon: 'logout', cTitle: 'Abmelden', cLink: null},
  ]


  constructor(private router: Router, private svAnimation: AnimationService, private renderer: Renderer2, private dialogSettings: MatDialog) {
  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    // place menu-action profile settings
    const dimenReference = this.vHeaderProfileImage.nativeElement.getBoundingClientRect()
    const dimenTarget = this.vProfileSettings.nativeElement.getBoundingClientRect()
    console.log("icon", dimenTarget)
    console.log("icon", dimenReference)
    const pxLeft = dimenReference.x + dimenReference.width - dimenTarget.width + dimenReference.width / 2
    this.renderer.setStyle(this.vProfileSettings.nativeElement, 'left', pxLeft + 'px')
    const pxTop = dimenReference.y + dimenReference.height
    console.log(pxTop)
    console.log(pxLeft)
    this.renderer.setStyle(this.vProfileSettings.nativeElement, 'top', pxTop + 'px')
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
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'height',  5 + 'rem')
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'width',  4 + 'rem')
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
      this.renderer.setStyle(this.vNavTwoImage.nativeElement, 'width',  17 + 'rem')
    }
    this.bNavExpanded = !this.bNavExpanded


  }

  onClick_NavItem(aNavItem: NavItem) {
    console.log("jooo", aNavItem)
    switch (aNavItem.id) {
      case this.ID_NAV_ITEM_SETTINGS:
        const dialogSettings = this.dialogSettings.open(SettingsDialog, {
          backdropClass: "d-backdrop",
        })
        break
      default:

        aNavItem.cLink && this.router.navigate([aNavItem.cLink])
    }
  }

  onClick_NavItemProfileSettings(aNavItem: NavItem) {

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

    this.renderer.setStyle(this.vNavTwo.nativeElement, "display", 'none')
    this.renderer.setStyle(this.vNavOne.nativeElement, "display", 'initial')
  }

  showNavTwo() {
    this.renderer.setStyle(this.vNavOne.nativeElement, "display", 'none')
    this.renderer.setStyle(this.vNavTwo.nativeElement, "display", 'initial')
  }
}
