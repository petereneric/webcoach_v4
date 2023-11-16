import {Injectable} from '@angular/core';
//import {AlertController} from '@ionic/angular';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class Alert {

  constructor(private router: Router) {
  }

  async info(header: string, message: string, ) {
    /*
    return new Promise(async (resolve) => {
        const alert = await this.alertController.create({
          cssClass: 'alert',
          header: header,
          message: message,
          buttons: ['Ok']
        });
        await alert.present();
      }
    )

     */
  }

  async invalid() {
/*
return new Promise(async (resolve) => {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Ungültige Eingabe',
      message: 'Bitte überprüfe deine Daten und korrigiere diese an den markierten Stellen.',
      buttons: ['Ok']
    });
    await alert.present();
  }
)

 */
}

async invalidInput(input: string): Promise<any> {
/*
return new Promise(async (resolve) => {
const alert = await this.alertController.create({
  cssClass: 'alert',
  header: 'Ungültige Eingabe',
  subHeader: input,
  buttons: [{text: 'Ok'}]
});
await alert.present();
}
);

 */
}

async takenName(name: string): Promise<any> {
/*
return new Promise(async (resolve) => {
const alert = await this.alertController.create({
cssClass: 'alert',
header: 'Name vergeben',
subHeader: name,
buttons: [{text: 'Ok'}]
});
await alert.present();
}
);

 */
}

async checkEmail() {
/*
const alert = await this.alertController.create({
cssClass: 'alert',
header: 'E-Mail versendet',
message: 'Bitte öffne die E-Mail die wir Dir zugesendet haben und befolge die Anweisungen.',
buttons: [{text: 'Ok'}]
});

await alert.present();

 */
}

async unknownEmail() {
/*
const alert = await this.alertController.create({
cssClass: 'alert',
header: 'Ungültige Eingabe',
subHeader: 'E-Mail-Adresse unbekannt',
message: 'In unserer Datenbank existiert kein Nutzer mit dieser E-Mail Adresse.',
buttons: ['Ok']
});

await alert.present();

 */
}


  async invalidPasswordToken() {
    /*
      const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Dieser Link ist ungültig',
      message: 'Möglicherweise ist der Link abegelaufen, da er nach Zusendung nur eine gewisse Zeit lang gültig ist. In diesem Fall kannst du dir einen neuen zusenden lassen.',
      buttons: [{text: 'Ok', handler: () => {this.router.navigate(['/passwort-zurücksetzen'])}}]
      });

      await alert.present();
      */

      }


}
