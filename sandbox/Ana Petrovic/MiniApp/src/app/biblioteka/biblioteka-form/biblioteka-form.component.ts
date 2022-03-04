import { Component, OnInit } from '@angular/core';
import { BibliotekaService } from 'src/app/shared/biblioteka.service';
import { NgForm} from '@angular/forms';
import {Biblioteka } from 'src/app/shared/biblioteka.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-biblioteka-form',
  templateUrl: './biblioteka-form.component.html',
  styles: [
  ]
})
export class BibliotekaFormComponent implements OnInit {

  constructor(public service:BibliotekaService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm) {
    if(this.service.formData.id==0)
    this.insertRecord(form);
    else this.updateRecord(form);
  }
  
  insertRecord(form: NgForm) {
    this.service.postBiblioteka().subscribe(
      res => {
        this.resetForm(form);
        this.service.refreshList();
        this.toastr.success('Knjiga je unesena');
      },
      err => { console.log(err); }
    )
    }
    updateRecord(form: NgForm){
      this.service.putBiblioteka().subscribe(
        res =>{
          this.resetForm(form);
          this.service.refreshList();
          this.toastr.success('Knjiga je izmenjena');
        },
        err => { console.log(err);}
      );
    }
    
    resetForm(form:NgForm){
      form.form.reset();
      this.service.formData = new Biblioteka();
    }
}
