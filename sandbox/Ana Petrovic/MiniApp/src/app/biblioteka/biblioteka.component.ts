import { Component, OnInit } from '@angular/core';
import {  BibliotekaService } from '../shared/biblioteka.service';
import { Biblioteka } from 'src/app/shared/biblioteka.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-biblioteka',
  templateUrl: './biblioteka.component.html',
  styles: [
  ]
})
export class BibliotekaComponent implements OnInit {

  constructor(public service: BibliotekaService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }
  populateForm(selectedRecord:Biblioteka){
    this.service.formData = Object.assign({}, selectedRecord);
  }
  onDelete(id:number){
    if(confirm('Da li ste sigurni da zelite da obrisete knjigu?'+id)){
    this.service.deleteBiblioteka(id)
    .subscribe(
      res =>{
        this.service.refreshList();
        this.toastr.error("Knjiga je uspesno obrisana");
      },
      err =>{ console.log(err)}
    )
    }
  }
}
