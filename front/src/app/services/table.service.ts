import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http:HttpClient) { }

  getAll(filename: string, dataType : string, rows : number, page : number):Observable<any>{
    return this.http.post("https://localhost:7219/api/PythonComm/getTableData",{"FileName" : filename, "DataType" : dataType, "Rows" : rows, "PageNum": page});
  }

  getStatistics(filename: string, colIndex: number):Observable<any> {
    return this.http.post("https://localhost:7219/api/PythonComm/getStatistics",{"FileName" : filename, "ColIndex": colIndex});
  }

  deleteRows(filename:string, rownum : number[])
  {
    console.log("iz servisa " + rownum)
    return this.http.post("https://localhost:7219/api/Csv/deletefilerow", {"fileName" : filename, "rowNumber" : rownum});
  }

  editCell(fileName: string, rowNumber: number, columnName: string,value: string)
  {
    return this.http.post("https://localhost:7219/api/Csv/updatefilerow" , {"fileName" : fileName, "rowNumber": rowNumber, "columnName": columnName,"value": value});
  }
}
