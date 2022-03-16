import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /*
  getAllFilesFromUser(id: any): Observable<JSON[]> {
    return this.http.get<JSON[]>("https://localhost:7219/api/User/"+id);
  } */
  

}
