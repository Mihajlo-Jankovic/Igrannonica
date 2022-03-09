import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginComponent } from '../components/login/login.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService()
@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient,private cookieService: CookieService) { }

/*
 login(username: string, password: string): Observable<string> {
    //console.log(username, password);
    var headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<string>('https://localhost:7219/api/User/login',
    {
      "username": username,
      "password": password
    }, { headers, responseType: 'text' as 'json' })
  }*/

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
