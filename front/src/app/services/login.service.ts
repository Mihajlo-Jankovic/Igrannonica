import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private connString : string = "https://localhost:7219/";

  
  login(username: any, password: any): Observable<string> {
    return this.http.post<string>(this.connString+"api/User/login",
    {
      "username": username,
      "password": password
    })
  }

  /*
  registration(name:any, surname:any, username:any, password:any) {
    return this.http.post<string>("",
    {
      "name": name,
      "surname": surname,
      "username": username,
      "password": password
    })
    
  } */

}
