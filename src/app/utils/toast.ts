import {Injectable} from '@angular/core';
//import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})

export class Toast {

  constructor() {
  }


  async show(message: string) {
  /*
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      cssClass: 'my-toast',
      position: 'bottom'
    });
    await toast.present()

   */
  }

  async saved() {
/*
  const toast = await this.toastController.create({
    message: 'Deine Daten wurden erfolgreich gespeichert.',
    duration: 2500,
    cssClass: 'my-toast',
    position: 'bottom'
  });
  await toast.present()

 */

}

async deleted() {
/*
const toast = await this.toastController.create({
message: 'Deine Daten wurden erfolgreich gelöscht.',
duration: 2500,
cssClass: 'my-toast',
position: 'bottom'
})
await toast.present

 */
}

async uploadSuccessful() {
/*
const toast = await this.toastController.create({
message: 'Deine Daten wurden erfolgreich hochgeladen.',
duration: 2500,
cssClass: 'my-toast',
position: 'bottom'
});
await toast.present()

 */
}
}
