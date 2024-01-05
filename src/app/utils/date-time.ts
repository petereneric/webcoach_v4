import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
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

  isFuture(timestamp: number | undefined) {
    let dToday = new Date()
    let dCompare = new Date((Number(timestamp)) * 1000)

    return dCompare > dToday
  }

  dateTimeToTimeStamp(dateTime: any) {
    return Math.floor(new Date(dateTime).getTime() / 1000)
  }

  secondsToDefault(seconds: number) {
    let minutes = Math.floor(seconds / 60)
    let _seconds = Number((Math.round((seconds % 60) * 100) / 100).toFixed(0));
    return minutes + ":" + (_seconds < 10 ? '0' + _seconds : _seconds)
  }

  secondsToMinute(seconds: number) {
    let minutes = Math.floor(seconds / 60)
    let _seconds = Number((Math.round((seconds % 60) * 100) / 100).toFixed(0));
    return _seconds < 30 ? minutes : minutes + 1
  }

  secondsToHourAndMinute(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours + "h " + minutes + "min"
  }

  timeAgo(dateTime: string | null) {
    if (dateTime !== null) {
      let seconds = Math.floor((new Date().getTime() - new Date(dateTime).getTime()) / 1000);

      let interval = Math.floor(seconds / 31556952)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Jahr' : 'vor ' + interval + ' Jahren'
      }

      interval = Math.floor(seconds / 2629746)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Monat' : 'vor ' + interval + ' Monaten'
      }

      interval = Math.floor(seconds / 604800)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Woche' : 'vor ' + interval + ' Wochen'
      }

      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Tag' : 'vor ' + interval + ' Tagen'
      }

      interval = Math.floor(seconds / 3600)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Stunde' : 'vor ' + interval + ' Stunden'
      }

      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        return interval == 1 ? 'vor 1 Minute' : 'vor ' + interval + ' Minuten'
      }

      interval = Math.floor(seconds)
      return interval == 1 ? 'vor 1 Sekunde' : 'vor ' + interval + ' Sekunden'
    } else {
      return ""
    }
  }
}
