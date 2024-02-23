import {Injectable} from "@angular/core";
import {DialogService} from "../services/dialogs/dialog.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Dialog} from "@angular/cdk/dialog";

@Injectable({
  providedIn: 'root'
})

export class File {

  constructor(private sanitizer: DomSanitizer, private svDialog: DialogService) {

  }

  checkPdf(file: any) {
    let type = file.type;

    if (type !== 'application/pdf') {
      this.svDialog.invalidFileFormat()
      return false
    }

    return this.checkFile(file)
  }

  checkFileType(file: any) {
    let type = file.type;

    // TODO Add python file check
    if (type !== 'application/pdf' && false) {
      this.svDialog.invalidFileFormat()
      return false
    }

    return this.checkFile(file)
  }

  checkFile(file: any) {
    if (file.length === 0) return false

    if (file.size > 1000000) {
      this.svDialog.invalidFileSize()
      return false
    }
    return true
  }

  async getUrl(file: any): Promise<string | ArrayBuffer | null> {
    if (!this.defaultCheckType(file)) return null
    if (!this.defaultCheckSize(file)) return null
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        let url = reader.result;
        resolve(url)
      };
    })
  }

  async getUrlImage(file: any): Promise<string | ArrayBuffer | null> {
    if (!this.checkImageType(file)) return null
    if (!this.checkVideoSize(file)) return null
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        let url = reader.result;
        resolve(url)
      };
    })
  }

  async getUrlVideo(file: any): Promise<string | ArrayBuffer | null> {
    if (!this.checkVideoType(file)) return null
    if (!this.checkVideoSize(file)) return null
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        let url = reader.result;
        resolve(url)
      };
    })
  }



  openUrl(url: any) {
    const contentType = 'application/pdf';
    const base64ImageData = url
    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      // @ts-ignore
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  }

  downloadUrl(url: any) {
    const contentType = url.substring("data:".length, url.indexOf(";base64"))
    const base64ImageData = url
    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      // @ts-ignore
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a')
    a.href = blobUrl
    a.download ="test"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  openBlob(blob: Blob) {
    let promise = new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        let base64data = reader.result;
        resolve(base64data)
      }
    })
    promise.then(data => {
      let url = data
      console.log(url)
      this.openUrl(url)
    })
  }

  playVideoInNewTab(video: Blob) {
    var blob = new Blob([video], { type: 'video/mp4' });
    var url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  pushVideoToDownloadFolder(video: Blob, cFileName: string) {
    const anchor = document.createElement('a');
    anchor.download = cFileName + ".mp4";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(video);
    anchor.click();
  }

  openPDF(blob: Blob) {
    const file = new Blob([blob], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  base64ImageWebpToSourceImage(base64Image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/webp;base64,' + base64Image);
  }

  base64DocumentToSourcePDF(base64PDF) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64PDF);
  }

  base64ToBlob( base64, type = "application/octet-stream" ) {
    const binStr = atob( base64 );
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[ i ] = binStr.charCodeAt( i );
    }
    return new Blob( [ arr ], { type: type } );
  }

  base64CutOffMetaData(base64) {
    return base64.split(',')[1]
  }

  defaultCheckSize(file: any) {
    console.log(file.size)
    if (file.size <= 10000000) {
      return true
    }
    this.svDialog.invalidFileSize()
    return false
  }

  defaultCheckType(file: any) {
    switch (file.type) {
      case "application/pdf":
        return true
    }
    this.svDialog.invalidFileFormat()
    return false
  }

  checkVideoSize(file: any) {
    if (file.size <= 100000000) {
      return true
    }
    this.svDialog.invalidFileSize()
    return false
  }

  checkVideoType(file: any) {
    console.log(file.type)
    switch (file.type) {
      case "video/mp4":
        return true
    }
    this.svDialog.invalidFileFormat()
    return false
  }

  checkImageSize(file: any) {
    if (file.size <= 10000000) {
      return true
    }
    this.svDialog.invalidFileSize()
    return false
  }

  checkImageType(file: any) {
    console.log(file.type)
    switch (file.type) {
      case "image/webp":
        return true
    }
    this.svDialog.invalidFileFormat()
    return false
  }
}
