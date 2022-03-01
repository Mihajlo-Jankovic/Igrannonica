import { Component, OnInit, Input } from '@angular/core';
import {Movie} from '../../Movie';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css']
})
export class MovieItemComponent implements OnInit {
  @Input() movie!: Movie;
  faTimes = faTimes;
  
  constructor() {}

  ngOnInit(): void {}

}
