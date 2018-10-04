import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

import { Movie } from '../models/movie';
import { MOVIES } from '../models/mock-movies';
import { MessageService } from './message.service';

@Injectable()
export class MovieService {

  apiRoot = 'http://localhost:8000/api/movies';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
        this.messageService.add(`MovieService: fetching all movies`);
        return this.http.get<Movie[]>(this.apiRoot);
  }

  // @TODO needs db
  getMovie(id: number): Observable<Movie> {
        this.messageService.add(`MovieService: fetched movie id=${id}`);
        return this.http.get<Movie>(this.apiRoot + '/' + id);
  }

  editMovie(id: number, movie: Movie) {
      this.messageService.add(`MovieService: editing movie id=${id} with data ${JSON.stringify(movie)}`);
        const data = {
          'title': movie.title,
          'series': movie.series,
          'series_num': movie.series_num,
          'owner': movie.owner
        };
        return this.http.put<Response>(this.apiRoot + '/' + id, data);
  }


  // @TODO needs DB
  addMovie(movie: Movie): Observable<Response> {
    this.messageService.add(`MovieService: adding movie with data ${JSON.stringify(movie)}`);
    // add the movie
    const data = {
      'title': movie.title,
      'director': movie.director,
      'format': movie.format,
      'series': movie.series,
      'series_num': movie.series_num,
      'owner': movie.owner
    };

     return this.http.post<Response>(this.apiRoot, data);
  }

  // @TODO needs DB
  removeMovie(id: number): Observable<Response>{
    this.messageService.add(`MovieService: removing movie id=${id}`);
    return this.http.delete<Response>(this.apiRoot + '/' + id);
  }

}
