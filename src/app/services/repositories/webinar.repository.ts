import {Injectable} from '@angular/core';
import {ApiService} from "../api/api.service";
import {Webinar} from "../../interfaces/webinar";

@Injectable({
  providedIn: 'root'
})
export class WebinarRepository {

  constructor(private api: ApiService) {
  }

  safeGet_Webinar(kWebinar, callback) {
    this.api.safeGet('webinar/' + kWebinar, (aWebinar: Webinar) => callback(aWebinar))
  }

  get_Thumbnail(kWebinar, callback) {
    this.api.getImage('webinar/cover/' +  kWebinar, urlImage => callback(urlImage))
  }
}
