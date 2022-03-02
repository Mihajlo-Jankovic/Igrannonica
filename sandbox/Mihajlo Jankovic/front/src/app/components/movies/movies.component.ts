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

  deleteMovie(movie: Movie)
  {
    //console.log(movie);
    this.movieService.deleteMovie(movie).subscribe(() => (this.movies = this.movies.filter(m => m.id !== movie.id)));
  }

  addMovie(movie: Movie)
  {
    this.movieService.addMovie(movie).subscribe((movie) => (this.movies.push(movie)));
  }
}
