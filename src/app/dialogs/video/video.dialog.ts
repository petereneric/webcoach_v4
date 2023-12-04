import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConnApiService} from "../../services/conn-api/conn-api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VjsPlayerComponent} from "../../components/vjs-player/vjs-player.component";
import {Unit} from "../../interfaces/unit";

@Component({
  selector: 'app-dialog-unit-video',
  templateUrl: './video.dialog.html',
  styleUrls: ['./video.dialog.sass']
})
export class VideoDialog implements OnInit, AfterViewInit, OnDestroy {

  // view-child
  @ViewChild(VjsPlayerComponent, {static: true}) vjsPlayer!: VjsPlayerComponent;
  @ViewChild('video', {static: true}) video: ElementRef | undefined = undefined

  // data
  urlVideo!: string

  constructor(private api: ConnApiService, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.urlVideo = this.data.urlVideo

  }

  onClose() {
    this.dialogRef.close();
  }

  setSource() {
    this.vjsPlayer?.updateSource(this.api.getUrl(this.urlVideo))
  }

  onVideoEvent($event: string) {

  }

  ngAfterViewInit(): void {
    this.setSource()
  }

  ngOnDestroy(): void {
    this.vjsPlayer.dispose()
  }
}
