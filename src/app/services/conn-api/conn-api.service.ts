import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  observe: 'response' as 'body'
}

@Injectable({
  providedIn: 'root'
})

export class ConnApiService {
  private urlApi: string = 'https://webcoach-api.digital/'

  // Registration
  public static getCollectorTypes: string = 'registration/collection-types'


  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
  }

  getUrl(path: string) {
    return this.urlApi + path
  }

  longGet(url: string) {
    return this.http.get<HttpResponse<any>>(`${this.urlApi}${url}`, httpOptions);
  }

  get(url: string, bodyFunction: any) {
    this.http.get<HttpResponse<any>>(`${this.urlApi}${url}`, httpOptions).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  safeGet(url: string, bodyFunction: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }

    this.http.get<HttpResponse<any>>(`${this.urlApi}${url}`, httpOptionsToken).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  longPost(url: string, json: any) {
    console.log(url);
    return this.http.post<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptions);
  }

  post(url: string, json: any, bodyFunction: any) {
    this.http.post<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptions).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  safePost(url: string, json: any, bodyFunction: any | null) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    this.http.post<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptionsToken).subscribe({
      next: response => {
        if (bodyFunction !== null) bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  put(url: string, json: any, bodyFunction: any) {
    this.http.put<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptions).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  longPut(url: string, json: any) {
    console.log(url);
    return this.http.put<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptions);
  }

  safePut(url: string, json: any, bodyFunction: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    this.http.put<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptionsToken).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  longSafePut(url: string, json: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.put<HttpResponse<any>>(`${this.urlApi}${url}`, json, httpOptionsToken);
  }

  safeUploadPut(url: string, data: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.put<HttpResponse<any>>(`${this.urlApi}${url}`, data, httpOptionsToken);
  }

  safeUpload(url: string, data: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.post<HttpResponse<any>>(`${this.urlApi}${url}`, data, httpOptionsToken);
  }

  safeGetFile(url: string, bodyFunction: any) {
    this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      responseType: 'blob'
    }).subscribe({
      next: blob => {
        if (bodyFunction !== null) bodyFunction(blob)
      }, error: error => {
        console.log(error)
      }
    })

    return this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      responseType: 'blob'
    });
  }

  getFile(url: string): any {
    return this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'blob'
    });
  }

  getVideo(url: string): any {
    return this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Range': 'bytes=0-1000'}),
      responseType: 'blob'
    });
  }

  safePostPDF(url: string, data: any): any {
    return this.http.post(`${this.urlApi}${url}`, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      responseType: 'blob'
    });
  }

  downloadImage(url: string, bodyFunction: any) {
    this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'blob'
    }).subscribe({
      next: (response: any) => {
        bodyFunction(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response)))
      }, error: error => {
        console.log(error)
      }
    })
  }

  safeDownloadImage(url: string, bodyFunction: any) {
    this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      responseType: 'blob'
    }).subscribe({
      next: (response: any) => {
        bodyFunction(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response)))
      }, error: error => {
        console.log(error)
      }
    })
  }

  safeDownload(url: string): any {
    return this.http.get(`${this.urlApi}${url}`, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      responseType: 'blob'
    });
  }

  safeDelete(url: string, bodyFunction: any) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.delete<HttpResponse<any>>(`${this.urlApi}${url}`, httpOptionsToken).subscribe({
      next: response => {
        bodyFunction(response.body)
      }, error: error => {
        console.log(error)
      }
    })
  }

  longSafeDelete(url: string) {
    var httpOptionsToken = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      observe: 'response' as 'body'
    }
    return this.http.delete<HttpResponse<any>>(`${this.urlApi}${url}`, httpOptionsToken);
  }
}

