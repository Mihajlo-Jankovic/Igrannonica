import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private cookie : CookieService) { }

  configuration = new Configuration();
  
  getAllUserExperiments()
  {
    if (this.cookie.check('token')) {
      var token = this.cookie.get('token');
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + token
      });
      let options = { headers: headers };

      return this.http.get<string>(this.configuration.userExperiments, options);
    }
  }

  deleteExperiment(id)
  {
    if (this.cookie.check('token')) {
      var token = this.cookie.get('token');
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + token
      });
      let options = { headers: headers };

      return this.http.post<string>(this.configuration.deleteExperiment, {'Id' : id}, options);
    }
  }

}
