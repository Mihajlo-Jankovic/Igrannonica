import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http:HttpClient) { }

  getAll():Observable<any>{
    return this.http.get("https://localhost:7219/api/PythonComm/getRequest");
  }
}
