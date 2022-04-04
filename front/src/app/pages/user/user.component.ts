import { Component, OnInit } from "@angular/core";
import { EditService } from "src/app/services/edit/edit.service";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditPasswordService } from "src/app/services/edit/edit-password.service";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {


  public editForm: FormGroup;
  public editPasswordForm: FormGroup;

  username: string;
  messageEditProfile: string;

  getUsername() {
    return sessionStorage.getItem('username');
  }


  constructor(private editService: EditService,private editPasswordService: EditPasswordService, private formBuilder : FormBuilder) {
    this.username = this.getUsername();
    this.messageEditProfile = "";
    this.editForm = formBuilder.group({firstname:"", lastname:""});
    this.editPasswordForm = formBuilder.group({currentPassword:"",newPassword:""});
  }
  ngOnInit() {
  }

  public get m() {
    return this.editForm.controls;
  }
  
  edit(form: FormGroup) {
    if (form.value.firstname && form.value.lastname) {
      this.messageEditProfile = "Succesfully changed";
      this.editService.edit(form.value.firstname, form.value.lastname).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
      })
    }
  }

  editPassword(form: FormGroup) {
    if (form.value.currentPassword && form.value.newPassword) {
      this.editPasswordService.edit(form.value.currentPassword, form.value.newPassword).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
      })
    }
  }

}
