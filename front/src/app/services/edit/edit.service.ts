import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class EditService {

  loggedUser: boolean;
  token: string;
  constructor(private http: HttpClient, private loginService: LoginService, private cookie: CookieService) { }

  configuration = new Configuration();

  ngOnInit() {
    

  }

  edit(firstname: any, lastname:any){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('token');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.post<string>(this.configuration.editUsername,
    {
      "firstname": firstname,
      "lastname": lastname
    }
      ,options
    
    )
  }
}
