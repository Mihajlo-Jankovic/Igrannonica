
import { ProfileService } from './../../shared/profile.service';
import { Profile } from 'src/app/shared/profile.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styles: []
})
export class ProfileFormComponent implements OnInit {

  constructor(public service: ProfileService) { }

  ngOnInit():void {
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.service.formData = new Profile();
  }

  
  insertRecord(form: NgForm) {
    this.service.postProfile().subscribe(
      res => {
        this.resetForm(form);
        this.service.refreshList();
      },
      err => { console.log(err); }
    )
  }
  onSubmit(form: NgForm) {
    if (this.service.formData.ProfileID == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }
  
  updateRecord(form: NgForm) {
    this.service.putProfile().subscribe(
      res => {
        this.resetForm(form);
        this.service.refreshList();
      },
      err => {
        console.log(err);
      }
    )
  }
}