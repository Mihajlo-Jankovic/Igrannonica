import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  loggedUser: boolean;
  token: string;
  constructor(private http: HttpClient, private loginService: LoginService, private cookie: CookieService) { }

  configuration = new Configuration();

  ngOnInit() { }

  info(){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.get(this.configuration.getNameSurnameEmail,options)
  }


  edit(currentPassword: any, newPassword:any){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.post<string>(this.configuration.editPassword,
    {
      "oldPassword": currentPassword,
      "newPassword": newPassword
    }
      ,options
    
    )
  }

  tempPass(email:any){
    return this.http.post<string>(this.configuration.tempPassword,
    {
      "email": email
    }
    )
  }
}
