import { Pipe, PipeTransform } from '@angular/core';
import {Comment} from "../interfaces/comment";

@Pipe({
  standalone: true,
  name: 'comment'
})
export class CommentPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): Comment {
    return value;
  }

}
