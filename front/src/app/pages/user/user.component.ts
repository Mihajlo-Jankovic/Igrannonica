import { Component, OnInit } from "@angular/core";
import { EditService } from "src/app/services/edit/edit.service";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditPasswordService } from "src/app/services/edit/edit-password.service";
import { UserInfoService } from "src/app/services/edit/user-info.service";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.scss"]
})
export class UserComponent implements OnInit {


  public editForm: FormGroup;
  public editPasswordForm: FormGroup;

  username: string;
  messageEditProfile: string;
  indicator : string;
  userInfo : any;

  getUsername() {
    return sessionStorage.getItem('username');
  }


  constructor(private userInfoService: UserInfoService,private editService: EditService,private editPasswordService: EditPasswordService, private formBuilder : FormBuilder) {
    this.username = this.getUsername();
    this.messageEditProfile = "";
    this.editForm = formBuilder.group({firstname:"", lastname:""});
    this.editPasswordForm = formBuilder.group({currentPassword:"",newPassword:""});
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.info().subscribe(data=> {
      this.userInfo = data;
    })
  }

  public get m() {
    return this.editForm.controls;
  }

  editProfile(){
    this.indicator = "edit";
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
  
  clcDiv: boolean = false;

  openDiv() {
    if(this.clcDiv == false) {
      this.clcDiv = true;
    }
    else {
      this.clcDiv = false;
    }
  }
}
