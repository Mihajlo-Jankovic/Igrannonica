import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PorudzbineDetails } from 'src/app/shared/porudzbine-details.model';
import { PorudzbineDetailsService } from 'src/app/shared/porudzbine-details.service';

@Component({
  selector: 'app-porudzbine-details-form',
  templateUrl: './porudzbine-details-form.component.html',
  styles: [
  ]
})
export class PorudzbineDetailsFormComponent implements OnInit {

  constructor(public service:PorudzbineDetailsService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    if(this.service.formData.id == 0){
      this.insertRecord(form);
    }
    else{
      this.updateRecord(form);
    }
  }

  insertRecord(form:NgForm)
  {
    this.service.postPorudzbineDetails().subscribe(
      res => {
        this.resetForm(form);
        this.service.refreshlist();
        this.toastr.success('Uspesno dodato', 'Detalji dostave')
      },
      err => {console.log(err); }
    );
  }

  updateRecord(form:NgForm)
  {
    this.service.putPorudzbineDetails().subscribe(
      res => {
        this.resetForm(form);
        this.service.refreshlist();
        this.toastr.info('Uspesno izmenjeno', 'Detalji dostave')
      },
      err => {console.log(err); }
    );
  }

  resetForm(form:NgForm){
    form.form.reset();
    this.service.formData = new PorudzbineDetails();
  }
}
