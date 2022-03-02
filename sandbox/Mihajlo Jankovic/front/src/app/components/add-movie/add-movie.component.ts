import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Movie} from '../../Movie';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  @Output() onAddMovie: EventEmitter<Movie> = new EventEmitter();

  name!: string;
  description!: string;
  rating!: number;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit()
  {
    if(!this.name)
    {
      alert("Unesite ime filma")
    }

    const newMovie = {
      name: this.name,
      description: this.description,
      rating: this.rating
    }

    this.onAddMovie.emit(newMovie);

    this.name = "";
    this.description = "";
    this.rating = 0;
  }

}
