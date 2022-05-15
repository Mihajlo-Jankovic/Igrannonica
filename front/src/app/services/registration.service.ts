import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  configuration = new Configuration();

  register(username : any, password : any, firstname: string, lastname: string, email:any)
  {
    return this.http.post<string>(this.configuration.register,
    {
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "username": username,
      "password": password
    })
  }

  verifyMail(code:number,email:string){
    return this.http.get<any>(this.configuration.verifyMail + "?verifyNumber="+ code + "&" + "email=" + email);
  }

}
