import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http:HttpClient) { }

  getAll(dataType : string, rows : number):Observable<any>{
    return this.http.post("https://localhost:7219/api/PythonComm/getTableData",{"FileName" : "movies.csv", "DataType" : dataType, "Rows" : rows});
  }
}
