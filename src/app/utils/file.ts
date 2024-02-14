import {Injectable} from "@angular/core";
import {DialogService} from "../services/dialogs/dialog.service";
import {DomSanitizer} from "@angular/platform-browser";

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
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        let url = reader.result;
        console.log(url)
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

  openPDF(blob: Blob) {
    const file = new Blob([blob], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  base64ImageWebpToSourceImage(base64Image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/webp;base64,' + base64Image);
  }
}
