import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Profile } from 'src/app/shared/profile.model';
import { ProfileService } from 'src/app/shared/profile.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styles: [
  ]
})
export class ProfileFormComponent implements OnInit {

  constructor(public service: ProfileService) { }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm){
    if(this.service.formData.userID == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }
  insertRecord(form: NgForm){
    this.service.postProfile().subscribe(
      res=>{
        this.resetForm(form);
        this.service.refreshList();
      },
      err=>{
        console.log(err);
      }
    );
  }
  updateRecord(form: NgForm){
    this.service.putProfile().subscribe(
      res=>{
        this.resetForm(form);
        this.service.refreshList();
      },
      err=>{
        console.log(err);
      }
    );
  }

  resetForm(form: NgForm){
    form.form.reset();
    this.service.formData = new Profile();
  }
}
