import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Movie} from '../Movie';
import {MOVIES} from '../mock-movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }

  getMovies(): Observable<Movie[]> {
    const movies = of(MOVIES)
    return movies;
  }
}
