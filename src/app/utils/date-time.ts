import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import {min} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DateTime {


  constructor(private datePipe: DatePipe) {

  }

  sqlDateToDefault(date: any) {
    return this.datePipe.transform(date, 'dd.MM.YYYY')
  }

  sqlDateTimeToDefault(dateTime: any) {
    return this.datePipe.transform(dateTime, 'dd.MM.YYYY \'um\' H.mm \'Uhr\'')
  }

  sqlDateTimeToDefaultDate(dateTime: any) {
    return this.datePipe.transform(dateTime, 'dd.MM.YYYY')
  }

  sqlDateTimeToMonthYearDate(dateTime: any) {
    return this.datePipe.transform(dateTime, 'MM.YYYY')
  }

  sqlDateTimeToDefaultTime(dateTime: any) {
    return this.datePipe.transform(dateTime, 'H.mm \'Uhr\'')
  }

  sqlDateTimeToIonic(dateTime: any) {
    return this.datePipe.transform(dateTime, 'YYYY-MM-ddTHH:mm')
  }

  isFuture(timestamp: number | undefined) {
    let dToday = new Date()
    let dCompare = new Date((Number(timestamp)) * 1000)

    return dCompare > dToday
  }

  dateTimeToTimeStamp(dateTime: any) {
    return Math.floor(new Date(dateTime).getTime() / 1000)
  }

  dateTimeIonicToTimeStamp(dateTime: any) {
    // ionic dates take local time not utc and therefore need to be corrected
    return Math.floor(new Date(dateTime).getTime() / 1000 - new Date().getTimezoneOffset()*60)
  }

  secondsToDefault(seconds: number) {
    let minutes = Math.floor(seconds/60)
    let _seconds = Number((Math.round((seconds%60) * 100) / 100).toFixed(0));
    return minutes + ":" + (_seconds < 10 ? '0' + _seconds : _seconds)
  }

  secondsToMinute(seconds: number) {
    let minutes = Math.floor(seconds/60)
    let _seconds = Number((Math.round((seconds%60) * 100) / 100).toFixed(0));
    return _seconds < 30 ? minutes : minutes + 1
  }

  secondsToHourAndMinute(seconds: number) {
    const hours = Math.floor(seconds/3600)
    const minutes = Math.floor((seconds%3600)/60)
    return hours + "h " + minutes + "min"
  }
}
