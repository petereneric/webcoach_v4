import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../../../services/api/api.service";
import {CoachPortalService} from "../../../coach-portal.service";
import {Webinar} from "../../../../../../interfaces/webinar";
import {File} from "../../../../../../utils/file";
import {UnitMaterial} from "../../../../../../interfaces/unit-material";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrl: './media.component.sass'
})
export class MediaComponent implements OnInit {

  protected base64Cover: string | null = null
  protected base64Thumbnail: string | null = null
  protected base64TrailerThumbnail: string | null = null
  protected bTrailer: boolean = false

  constructor(protected uFile: File, private svCoachPortal: CoachPortalService, private svApi: ApiService) {
  }

  ngOnInit(): void {
    this.svCoachPortal.bsWebinar.subscribe(aWebinar => {
      this.svApi.safeGet('coach-portal/webinar/media/' + aWebinar?.id, response => {
        console.log("joo", response['base64Cover'])
        this.base64Cover = response['base64Cover']
        this.base64Thumbnail = response['base64Thumbnail']
        this.bTrailer = response['bTrailer'];
        this.base64TrailerThumbnail = response['base64ThumbnailTrailer']
      })
    })

  }


  onClick_AddCover(files: any) {
    let file: any = files[0]
    this.uFile.getUrlImage(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Cover: data
        }

        this.svApi.safeUpload('coach-portal/webinar/media/cover', d).subscribe({next: (response: any) => {
            this.base64Cover = String(this.uFile.base64CutOffMetaData(data))
          }, error: error => {
            console.log(error)
          }})
      }
    })
  }

  onClick_ChangeCover(files: any) {
    let file: any = files[0]
    this.uFile.getUrlImage(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Cover: data
        }
        this.svApi.safeDelete('coach-portal/webinar/media/cover/' + this.svCoachPortal.bsWebinar.value?.id, () => {
          this.base64Cover = null

          this.svApi.safeUpload('coach-portal/webinar/media/cover', d).subscribe({next: (response: any) => {
              this.base64Cover = String(this.uFile.base64CutOffMetaData(data))
            }, error: error => {
              console.log(error)
            }})
        })

      }
    })
  }

  onClick_DeleteCover() {
    this.svApi.safeDelete('coach-portal/webinar/media/cover/' + this.svCoachPortal.bsWebinar.value?.id, () => {
      this.base64Cover = null
    })
  }


  onClick_AddThumbnail(files: any) {
    let file: any = files[0]
    this.uFile.getUrlImage(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Thumbnail: data
        }

        this.svApi.safeUpload('coach-portal/webinar/media/thumbnail', d).subscribe({next: (response: any) => {
            this.base64Thumbnail = String(this.uFile.base64CutOffMetaData(data))
          }, error: error => {
            console.log(error)
          }})
      }
    })
  }

  onClick_ChangeThumbnail(files: any) {
    let file: any = files[0]
    this.uFile.getUrlImage(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Thumbnail: data
        }
        this.svApi.safeDelete('coach-portal/webinar/media/thumbnail/' + this.svCoachPortal.bsWebinar.value?.id, () => {
          this.base64Thumbnail = null

          this.svApi.safeUpload('coach-portal/webinar/media/thumbnail', d).subscribe({next: (response: any) => {
              this.base64Thumbnail = String(this.uFile.base64CutOffMetaData(data))
            }, error: error => {
              console.log(error)
            }})
        })

      }
    })
  }

  onClick_DeleteThumbnail() {
    this.svApi.safeDelete('coach-portal/webinar/media/thumbnail/' + this.svCoachPortal.bsWebinar.value?.id, () => {
      this.base64Thumbnail = null
    })
  }


  onClick_AddTrailer(files: any) {
    let file: any = files[0]
    this.uFile.getUrlVideo(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Trailer: data
        }

        this.svApi.safeUpload('coach-portal/webinar/media/trailer', d).subscribe({next: (response: any) => {
            this.base64TrailerThumbnail = response.base64TrailerThumbnail
            this.bTrailer = true
          }, error: error => {
            console.log(error)
          }})
      }
    })
  }

  onClick_ChangeTrailer(files: any) {
    let file: any = files[0]
    this.uFile.getUrlVideo(file).then(data => {
      if (data) {
        let d = {
          kWebinar: this.svCoachPortal.bsWebinar.value?.id,
          base64Trailer: data
        }
        this.svApi.safeDelete('coach-portal/webinar/media/trailer/' + this.svCoachPortal.bsWebinar.value?.id, () => {
          this.base64TrailerThumbnail = null
          this.bTrailer = false

          this.svApi.safeUpload('coach-portal/webinar/media/trailer', d).subscribe({next: (response: any) => {
            console.log(response.body.base64TrailerThumbnail)
              this.base64TrailerThumbnail = response.body.base64TrailerThumbnail
              this.bTrailer = true
            }, error: error => {
              console.log(error)
            }})
        })

      }
    })
  }

  onClick_DeleteTrailer() {
    this.svApi.safeDelete('coach-portal/webinar/media/trailer/' + this.svCoachPortal.bsWebinar.value?.id, () => {
      this.base64TrailerThumbnail = null
      this.bTrailer = false
    })
  }

}
