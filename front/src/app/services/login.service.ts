import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';


const jwtHelper = new JwtHelperService()
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  
  
  login(username : any, password : any)
  {
    return this.http.post<string>('https://localhost:7219/api/User/login',
    {
      "username": username,
      "password": password
    }
    )
  }

  isAuthenticated() : boolean
  {
    if(this.cookieService.check('token'))
    {
      var token = this.cookieService.get('token');
      return !jwtHelper.isTokenExpired(token);
    }

    return false;
  }

}
