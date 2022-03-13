import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegistrationComponent } from '../components/registration/registration.component';
import { NgForm, NgModel } from '@angular/forms';

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

  register(form: NgForm)
  {
    return this.http.post<string>('https://localhost:7219/api/User/register',
    {
      "firstname": form.value.firstname,
      "lastname": form.value.lastname,
      "email": form.value.email,
      "username": form.value.username,
      "password": form.value.password
    })
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
