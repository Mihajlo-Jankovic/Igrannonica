import { Router } from '@angular/router';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  message: string
  constructor(private router: Router, private cookie : CookieService) { }

  @Output() lanClickedEvent = new EventEmitter<string>();

  refreshLan(msg : string) {
      this.lanClickedEvent.emit(msg);
  }
  setMessage(data){
    this.message =data;
  }

  getMessage(){
    return this.message;
  }

//   @Output() languageClickedEvent = new EventEmitter<string>();

//   refreshLanguage(msg : string) {
//     this.languageClickedEvent.emit(msg);
// }

}
