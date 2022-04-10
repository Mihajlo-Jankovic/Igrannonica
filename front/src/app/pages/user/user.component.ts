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
  indicator : boolean=false;
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
    if(this.indicator==true)
      this.indicator=false;
    else this.indicator=true;
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
  
  niz: any= [1, 2, 3];
  clcDiv: any = [false, false, false];

  openDiv(index1:number) {
    
    if(this.clcDiv[index1] == false) {
      this.clcDiv[index1] = true;
    }
    else {
      this.clcDiv[index1] = false;
    }
  }

}
