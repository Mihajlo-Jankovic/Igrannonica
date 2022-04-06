import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http:HttpClient) { }

  configuration = new Configuration();

  getAll(filename: string, dataType : string, rows : number, page : number):Observable<any>{
    return this.http.post(this.configuration.tableData,{"FileName" : filename, "DataType" : dataType, "Rows" : rows, "PageNum": page});
  }

  getStatistics(filename: string, colIndex: number):Observable<any> {
    return this.http.post(this.configuration.statistics,{"FileName" : filename, "ColIndex": colIndex});
  }

  deleteRows(filename:string, rownum : number[])
  {
    return this.http.post(this.configuration.deleteTableRow, {"fileName" : filename, "rowNumber" : rownum});
  }

  editCell(fileName: string, rowNumber: number, columnName: string,value: string)
  {
    return this.http.post(this.configuration.editTableCell , {"fileName" : fileName, "rowNumber": rowNumber, "columnName": columnName,"value": value});
  }
}
