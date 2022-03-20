import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  register(username : any, password : any, firstname: string, lastname: string, email:any)
  {
    return this.http.post<string>('https://localhost:7219/api/User/register',
    {
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "username": username,
      "password": password
    })
  }
}
