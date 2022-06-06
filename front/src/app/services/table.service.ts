import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class TableService {
  loggedUser: boolean;
  token: string; 
  constructor(private http:HttpClient, private loginService: LoginService, private cookie: CookieService) { }

  configuration = new Configuration();

  getAll(filename: string, dataType : string, rows : number, page : number, colName: string):Observable<any>{
    return this.http.post(this.configuration.tableData,{"FileName" : filename, "DataType" : dataType, "Rows" : rows, "PageNum": page, "colName": colName});
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
  
  fillMissingValuesAuthorized(colName: string, fileName: string, fillMethod: string, specificVal: string)
  {
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('cortexToken');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };

    return this.http.post(this.configuration.fillMissingValuesAuthorized, {"colName": colName, "fileName": fileName, "fillMethod": fillMethod, "specificVal": specificVal}, options);
  }

  fillMissingValuesUnauthorized(colName: string, fileName: string, fillMethod: string, specificVal: string)
  {
    return this.http.post(this.configuration.fillMissingValuesUnauthorized, {"colName": colName, "fileName": fileName, "fillMethod": fillMethod, "specificVal": specificVal});
  }

  changeOutliersAuthorized(colName: string, fileName: string, fillMethod: string, specificVal: string)
  {
    this.loggedUser = this.loginService.isAuthenticated();
    if (this.loggedUser) {
      this.token = this.cookie.get('cortexToken');
    }
    let headers = new HttpHeaders({
      'Authorization': 'bearer ' + this.token
    });
    let options = { headers: headers };

    return this.http.post(this.configuration.changeOutliersAuthorized, {"colName": colName, "fileName": fileName, "fillMethod": fillMethod, "specificVal": specificVal, }, options);
  }

  changeOutliersUnauthorized(colName: string, fileName: string, fillMethod: string, specificVal: string)
  {
    return this.http.post(this.configuration.changeOutliersUnauthorized, {"colName": colName, "fileName": fileName, "fillMethod": fillMethod, "specificVal": specificVal});
  }
}
