import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConnApiService} from "../../../../services/conn-api/conn-api.service";
import {File} from "../../../../utils/file";
import {Webinar} from "../../../../interfaces/webinar";
import {Communication} from "../../../../services/communication/communication.service";
import {VjsPlayerComponent} from "../../../../components/vjs-player/vjs-player.component";
import {Section} from "../../../../interfaces/section";
import {DateTime} from "../../../../utils/date-time";
import {Unit} from "../../../../interfaces/unit";

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.page.html',
  styleUrls: ['./webinar.page.scss'],
})

export class WebinarPage implements OnInit, OnDestroy, AfterViewInit {

  // view-children
  @ViewChild(VjsPlayerComponent, {static: true}) vjsPlayer!: VjsPlayerComponent;
  @ViewChild('videoButtons') vVideoButtons!: any
  @ViewChild('video') vVideo!: any
  @ViewChild('videoButtonTextLeft') vVideoButtonTextLeft!: any
  @ViewChild('videoButtonTextRight') vVideoButtonTextRight!: any
  @ViewChild('videoButtonRight') vVideoButtonRight!: any
  @ViewChild('videoButtonLeft') vVideoButtonLeft!: any

  // data
  kWebinar: number | null = null
  oWebinar: Webinar | null = null
  lSections: Section[] | null = null
  oUnit: Unit | null = null

  // variables
  menuSelector: number = 0
  bDesktop: boolean = true

  // menu
  menu = [
    {id: 0, name: 'Kursinhalt'},
    {id: 1, name: 'Überblick'},
    {id: 2, name: 'Live-Session'},
  ]


  // constructor
  constructor(private renderer: Renderer2, private dateTime: DateTime, private svCommunication: Communication, private activatedRoute: ActivatedRoute, private uFile: File, private connApi: ConnApiService) {
  }


  ngOnInit() {

    // set desktop
    this.setDesktop()

    // route
    this.activatedRoute.params.subscribe(params => {
      this.kWebinar = params['kWebinar']

      // get webinar
      this.connApi.get('webinar/' + this.kWebinar, (data: Webinar) => {
        this.oWebinar = data
      })

      // get webinar sections
      this.connApi.safeGet('webinar/auth/sections/' + this.kWebinar, (data: Section[]) => {
        this.lSections = data

        // get unique webinar player settings if set yet or return null
        this.connApi.safeGet('webinar/auth/webinar-player/' + this.oWebinar?.id, (data: any) => {
          if (data !== null) {
            this.setCurrentUnit(null, data.kCurrentUnit)
          } else {
            this.setCurrentUnit(this.lSections![0].lUnits[0], null)
          }
        })
      })
    })

    // subscribe to unit change
    this.svCommunication.currentUnit.subscribe((unit) => {

      if (unit !== null) {
        // set and show video of current unit in video-js player
        this.vjsPlayer?.updateSource(this.connApi.getUrl('webinar/unit/video/' + unit.id))

        // set time of video to the last saved state
        this.vjsPlayer?.setTime(unit.oUnitPlayer!.secVideo)

        // prepare data
        let data = {
          kWebinar: this.oWebinar?.id,
          kCurrentUnit: this.svCommunication.currentUnit.value?.id
        }

        // save current unit to webinar player settings
        this.connApi.safePost('webinar/auth/webinar-player', data, (data: any) => {
        })

        // hide back on first video
        if (this.isFirst(unit)) {
          console.log("FIRST")
          this.vVideoButtonLeft.nativeElement.style.visibility = 'hidden'
        } else {
          this.vVideoButtonLeft.nativeElement.style.visibility = 'visible'
        }
        if (this.isLast(unit)) {
          this.vVideoButtonRight.nativeElement.style.visibility = 'hidden'
        } else {
          this.vVideoButtonRight.nativeElement.style.visibility = 'visible'
        }
      }
    });



  }

  ngAfterViewInit(): void {
    // video buttons
    console.log("YES")
    console.log("here" + this.vVideo.nativeElement.offsetHeight)
      var ro = new ResizeObserver(entries => {
        console.log("jo");
        console.log("here" + this.vVideo.nativeElement.offsetHeight)


        for (let entry of entries) {
          const cr = entry.contentRect;
          console.log('Element:', entry.target);
          console.log(`Element size: ${cr.width}px x ${cr.height}px`);
          console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);

          console.log("height: " + cr.height/2 + 'px')
          this.vVideoButtons.nativeElement.style.top = cr.height/2 + 'px';

        }
      });

      // Element for which to observe height and width
      ro.observe(this.vVideo.nativeElement);

  }

  mouseEnter(element: string) {
    switch (element) {
      case 'button-video-left':
        this.vVideoButtonTextLeft.nativeElement.style.visibility = 'visible'
        this.renderer.setProperty(this.vVideoButtonTextLeft.nativeElement, 'innerHTML', this.getBack());
        break;
      case 'button-video-right':
        this.vVideoButtonTextRight.nativeElement.style.visibility = 'visible'
        this.renderer.setProperty(this.vVideoButtonTextRight.nativeElement, 'innerHTML', this.getForward());
        break;
    }
  }

  mouseLeave(element: string) {
    this.vVideoButtonTextLeft.nativeElement.style.visibility = 'hidden'
    this.vVideoButtonTextRight.nativeElement.style.visibility = 'hidden'
  }


  ngOnDestroy(): void {
    // set current time
    let unit: Unit = this.svCommunication.currentUnit.value!
    unit.oUnitPlayer!.secVideo = this.vjsPlayer.getTime()

    // handle modified unit to function updateUnitPlayer
    this.updateUnitPlayer(unit)

    // close video-js player
    this.vjsPlayer.dispose()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setDesktop()
  }


  // interaction callback from unit component
  onEventUnit($event: any) {
    // declare unit
    let unit!: Unit

    // switch
    switch ($event.cEvent) {

      // unit selected
      case 'select':
        // set status and time to old unit
        unit = $event.unitOld
        unit.oUnitPlayer!.tStatus = 1
        unit.oUnitPlayer!.secVideo = this.vjsPlayer.getTime()

        // scroll to top for showing the current video
        this.scrollTop()
        break;

      // unit checked
      case 'check':
        // set status and time of checked unit
        unit = $event.unit
        console.log(unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0)
        unit.oUnitPlayer!.tStatus = unit.oUnitPlayer?.tStatus! < 2 ? 2 : 0
        unit.oUnitPlayer!.secVideo = 0
        break;
    }

    // update unit
    this.updateUnitPlayer(unit)
  }


  setCurrentUnit(currentUnit: Unit | null, kCurrentUnit: number | null) {
    if (currentUnit === null) {
      // find matching unit
      this.lSections?.forEach(section => {
        section.lUnits?.forEach(unit => {
          if (unit.id === kCurrentUnit) {
            currentUnit = unit
          }
        })
      })
    }

    this.svCommunication.currentUnit.next(currentUnit)
  }



  setNextUnit(currentUnit: Unit | null) {
    // set time for currentUnit to 0
    currentUnit!.oUnitPlayer!.secVideo = 0
    currentUnit!.oUnitPlayer!.tStatus = 2
    this.updateUnitPlayer(currentUnit!)

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
              if (unit.oUnitPlayer === null || unit.oUnitPlayer?.tStatus! < 2) {
                this.svCommunication.currentUnit.next(unit)
                bSelected = true
                break loop1
              }
            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
  }



  // callback from video-js player
  onVideoEvent($event: string) {
    switch ($event) {
      case 'ended':
        this.setNextUnit(this.svCommunication.currentUnit.value)
        break;
    }
  }


  // update unit-player
  updateUnitPlayer(unit: Unit) {
    // prepare data
    let data = {
      kUnit: unit.id,
      tStatus: unit.oUnitPlayer?.tStatus,
      secVideo: unit.oUnitPlayer?.secVideo,
    }

    // update unit-player settings
    this.connApi.safePost('webinar/auth/unit-player', data, null)

  }


  // scroll to top
  scrollTop() {
    //this.content.scrollToTop(500);
  }

  setDesktop() {
    this.bDesktop = window.innerWidth >= 1024

    if (this.bDesktop) {
      if (this.menuSelector === 0) this.menuSelector = 1
      this.menu = [
        {id: 1, name: 'Überblick'},
        {id: 2, name: 'Live-Session'},
      ]
    } else {
      if (this.menuSelector > 0) this.menuSelector = 0
      this.menu = [
        {id: 0, name: 'Kursinhalt'},
        {id: 1, name: 'Überblick'},
        {id: 2, name: 'Live-Session'},
      ]
    }

  }


  onForward() {
    this.mouseLeave("")
    let currentUnit = this.svCommunication.currentUnit.value
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
                this.svCommunication.currentUnit.next(unit)
                bSelected = true
                break loop1
            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
  }

  onBack() {
    this.mouseLeave("")
    let currentUnit = this.svCommunication.currentUnit.value
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
                this.svCommunication.currentUnit.next(section.lUnits[j-2])
                bSelected = true
                break loop1

            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
  }

  getForward() {
    let currentUnit = this.svCommunication.currentUnit.value
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
                return unit.cName
                bSelected = true
                break loop1

            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
    return ""
  }

  getBack() {
    let currentUnit = this.svCommunication.currentUnit.value
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
                return section.lUnits[j-2].cName
                bSelected = true
                break loop1

            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
      return ""
  }

  isFirst(currentUnit: Unit | null) {
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = 0; i < this.lSections?.length!; i++) {
        let section = this.lSections![i]
        loop2:
          for (let j = 0; j < section.lUnits?.length; j++) {
            let unit = section.lUnits[j]
            if (bSelect) {
              if (i === 0 && j-1 === 0) {
                return true
                bSelected = true
                break loop1
              } else {
                return false
              }
            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
    return false
  }

  isLast(currentUnit: Unit | null) {
    // set time for currentUnit to 0

    // find next unit and set it to current
    let bSelect = false
    let bSelected = false
    loop1:
      for (let i = this.lSections?.length!-1; i >= 0; i--) {
        let section = this.lSections![i]
        loop2:
          for (let j = section.lUnits?.length-1; j >= 0; j--) {
            let unit = section.lUnits[j]
            if (bSelect) {
              console.log("jo")
              console.log(i);
              console.log(j)
              if (i === this.lSections?.length!-1 && j === section.lUnits?.length-2) {
                return true
                bSelected = true
                break loop1
              } else {
                return false
              }
            }
            if (unit.id === currentUnit?.id) {
              bSelect = true
            }
          }
      }
    return false
  }
}
