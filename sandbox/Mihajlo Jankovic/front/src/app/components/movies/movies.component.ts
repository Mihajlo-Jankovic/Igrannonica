import { Component, OnInit } from '@angular/core';
import {MovieService} from '../../services/movie.service';
import {Movie} from '../../Movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe((movies) => (this.movies = movies));
  }

}
