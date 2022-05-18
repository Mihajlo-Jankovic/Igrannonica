import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Configuration } from 'src/app/configuration';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  loggedUser: boolean;
  token: string;
  constructor(private http: HttpClient, private loginService: LoginService, private cookie: CookieService) { }

  configuration = new Configuration();

  filesAuthorized(visibility: string, pageNum: number, numPerPage: number, numOfPages: number ){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('cortexToken');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.post<any>(this.configuration.authorizedFiles, {"visibility" : visibility, "pageNum" : pageNum, "numPerPage": numPerPage, "numOfPages": numOfPages}, options);
  }

  filesUnauthorized(visibility: string, pageNum: number, numPerPage: number, numOfPages: number){
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('cortexToken');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };
    return this.http.post<any>(this.configuration.unauthorizedFiles, {"visibility" : visibility, "pageNum" : pageNum, "numPerPage": numPerPage, "numOfPages": numOfPages})
  }
}
