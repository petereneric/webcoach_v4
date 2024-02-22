import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";
import {iDialog} from "../../interfaces/dialogs/iDialog";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  showDialog(content: iDialog) {
    let dialogRef = this.dialog.open(DialogComponent, {
      height: 'auto',
      backdropClass: "d-backdrop",
      data: content
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog closed")
    })
  }

  checkEmail() {
    this.showDialog({cTitle: "E-Mail versendet", cText: "Bitte öffne die E-Mail die wir Dir zugesendet haben und befolge die Anweisungen."})
  }

  unknownEmail() {
    this.showDialog({cTitle: "E-Mail unbekannt", cText: "Sorry, leider kennen wir Deine E-Mail Adresse nicht. Bitte gib eine korrekte E-Mail Adresse ein oder registriere Dich wenn Du noch keinen Webcoach Account hast."})
  }

  wrongPassword() {
    this.showDialog({cTitle: "Falsches Passwort", cText: "Sorry, dein Passwort ist falsch. Bitte versuche es erneut oder klicke auf Passwort vergessen, wenn du dieses nicht mehr kennst."})
  }

  invalidInput() {
    this.showDialog({cTitle: "Ungültige Eingabe", cText: "Bitte überprüfe deine Daten und korrigiere diese an den markierten Stellen."})
  }

  invalidEmail() {
    this.showDialog({cTitle: "Ungültige E-Mail", cText: "Es existiert bereits ein Nutzerkonto mit dieser E-Mail Adresse."})
  }

  invalidToken() {
    this.showDialog({cTitle: "Dieser Link ist ungültig", cText: "Möglicherweise ist der Link abegelaufen, da er nach Zusendung nur eine gewisse Zeit lang gültig ist. In diesem Fall kannst du dir einen neuen zusenden lassen."})
  }

  invalidFileFormat() {
    this.showDialog({cTitle: "Ungültiges Datei-Format", cText: "Leider unterstützen wir dieses Datei-Format nicht."})
  }

  invalidFileSize() {
    this.showDialog({cTitle: "Ungültige Datei-Größe", cText: "Deine Datei ist leider zu groß."})
  }



}
