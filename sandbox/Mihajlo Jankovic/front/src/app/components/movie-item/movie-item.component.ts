import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Movie} from '../../Movie';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css']
})
export class MovieItemComponent implements OnInit {
  @Input() movie!: Movie;
  @Output() onDeleteMovie: EventEmitter<Movie> = new EventEmitter();
  faTimes = faTimes;
  
  constructor() {}

  ngOnInit(): void {}

  onDelete(movie: Movie) {
    this.onDeleteMovie.emit(movie)
  }
}
