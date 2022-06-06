import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class ExpNameService{

  constructor(private router: Router, private cookie : CookieService) { }
  
  @Output() aClickedEvent = new EventEmitter<string>();
  @Output() fileClickedEvent = new EventEmitter<string>();

  refreshExperimentName(msg : string) {
      this.aClickedEvent.emit(msg);
  }

  filename(msg : string){
    this.fileClickedEvent.emit(msg);
  }
}
