import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Configuration } from '../configuration';


const jwtHelper = new JwtHelperService()
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  configuration = new Configuration();

  login(username: any, password: any) {
    return this.http.post<string>(this.configuration.login,
      {
        "username": username,
        "password": password
      }
    )
  }

  isAuthenticated(): boolean {
    if (this.cookieService.check('cortexToken')) {
      var token = this.cookieService.get('cortexToken');
      return !jwtHelper.isTokenExpired(token);
    }

    return false;
  }
  resetPassword(email: string) {
    return this.http.get<any>(this.configuration.tempPassword + email);
  }

  edit(currentPassword: any, newPassword:any){
    return this.http.post<string>(this.configuration.resetPassword,
    {
      "oldPassword": currentPassword,
      "newPassword": newPassword
    }
    
    )
  }
  verifyMail(code:number,email:string){
    return this.http.get<any>(this.configuration.verifyMail + "?verifyNumber="+ code + "&" + "email=" + email);
  }

}
