import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


import { MessageService } from './message.service';

@Injectable()
export class CoverService {

  apiRoot:string = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getCover(isbn: string) {
        this.messageService.add(`CoverService: fetching cover for ${isbn.replace(/-/g,'')} from ${this.apiRoot}`);
        return this.http.get(this.apiRoot+isbn.replace(/-/g,''));
  }

}
