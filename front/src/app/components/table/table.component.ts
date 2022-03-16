import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  tableData:Array<any> = [];

  constructor(private tableService : TableService){
    this.tableService.getAll().subscribe(
      (response)=>{
        console.log(response)
        this.tableData = response;
      }
    )
    
  }

}
