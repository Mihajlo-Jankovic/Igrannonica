import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class EditPasswordService {

  loggedUser: boolean;
  token: string;
  constructor(private http: HttpClient, private loginService: LoginService, private cookie: CookieService) { }

  edit(currentPassword: any, newPassword:any){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.post<string>('https://localhost:7219/api/User/EditUserPassword',
    {
      "oldPassword": currentPassword,
      "newPassword": newPassword
    }
      ,options
    
    )
  }
}
