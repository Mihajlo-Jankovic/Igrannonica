import { Router } from '@angular/router';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private router: Router, private cookie : CookieService) { }

  @Output() languageClickedEvent = new EventEmitter<string>();

  refreshLanguage(msg : string) {
    this.languageClickedEvent.emit(msg);
}

}
