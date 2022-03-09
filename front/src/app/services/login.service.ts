import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  //private connString : string = "https://localhost:7219/";
  //formData: User = new User();
  /*
  login(username: string, password: string): Observable<string> {
    console.log(username, password);
    return this.http.post<string>(this.connString+"api/User/login",
    {
      "username": username,
      "password": password
    })
  }*/

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
