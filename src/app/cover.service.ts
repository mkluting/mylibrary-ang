import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


import { MessageService } from './message.service';

@Injectable()
export class CoverService {

  bookCoverApiRoot = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
  moviePosterApiRoot = 'https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getCover(isbn: string) {
        this.messageService.add(`CoverService: fetching cover for ${isbn.replace(/-/g,'')} from ${this.bookCoverApiRoot}`);
        return this.http.get(this.bookCoverApiRoot + isbn.replace(/-/g,''));
  }

  getMoviePoster(title: string) {
      this.messageService.add(`CoverService: fetching movie poser for ${title} from ${this.moviePosterApiRoot}`);
      return this.http.get(this.moviePosterApiRoot + title);
  }

}
