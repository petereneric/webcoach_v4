import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  // urls
  urlAuthenticate: string = 'https://webcoach-api.digital/authenticate'

  constructor(private http: HttpClient) { }

  authenticate() {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.post<HttpResponse<any>>(this.urlAuthenticate, null, httpOptionsToken);
  }
}
