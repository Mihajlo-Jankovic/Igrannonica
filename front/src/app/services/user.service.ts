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
  
  getAllUserExperiments(visibility, pageNum, numPerPage, numOfPages)
  {
    if (this.cookie.check('cortexToken')) {
      var token = this.cookie.get('cortexToken');
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + token
      });
      let options = { headers: headers };

      return this.http.post<string>(this.configuration.userExperiments, {"visibility" : visibility, "pageNum" : pageNum, "numPerPage" : numPerPage, "numOfPages" : numOfPages},  options);
    }
  }

  getPublicExperiments(visibility, pageNum, numPerPage, numOfPages)
  {
      return this.http.post<string>(this.configuration.publicExperiments, {"visibility" : visibility, "pageNum" : pageNum, "numPerPage" : numPerPage, "numOfPages" : numOfPages});
  }

  deleteExperiment(id)
  {
    if (this.cookie.check('cortexToken')) {
      var token = this.cookie.get('cortexToken');
      let headers = new HttpHeaders({
        'Authorization': 'bearer ' + token
      });
      let options = { headers: headers };

      return this.http.post<string>(this.configuration.deleteExperiment, {'Id' : id}, options);
    }
  }

}
