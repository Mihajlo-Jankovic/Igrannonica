import { Component, OnInit } from "@angular/core";
import { EditService } from "src/app/services/edit/edit.service";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditPasswordService } from "src/app/services/edit/edit-password.service";
import { UserInfoService } from "src/app/services/edit/user-info.service";
import { HttpClient } from "@angular/common/http";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.scss"]
})
export class UserComponent implements OnInit {

  data = {
    'name' : "",
    'fileName' : "",
    'inputList' : [],
    'output' : "",
    'problemType' : "",
    'encodingType' : "",
    'optimizer' : "",
    'regularization' : "",
    'lossFunction' : "",
    'ratio' : 0,
    'activationFunction' : "",
    'learningRate' : 0,
    'regularizationRate' : 0,
    'epochs' : 0,
    'numLayers' : 0,
    'layerList' : [],
    'metrics' : []
  }

  public editForm: FormGroup;
  public editPasswordForm: FormGroup;

  experiments : any = []

  username: string;
  messageEditProfile: string;
  indicator : boolean=false;
  userInfo : any;

  getUsername() {
    return sessionStorage.getItem('username');
  }

  constructor(private toastr: ToastrService,private userInfoService: UserInfoService,private editService: EditService,private editPasswordService: EditPasswordService, private formBuilder : FormBuilder, private userService : UserService) {
    this.messageEditProfile = "";
    this.editForm = formBuilder.group({firstname:"", lastname:""});
    this.editPasswordForm = formBuilder.group({currentPassword:"",newPassword:""});
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.info().subscribe(data=> {
      this.userInfo = data;
    })
    //this.showExperiments()
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
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Succesfully changed</b>.', '', {
        disableTimeOut: false,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-top-center'
      });
      this.editService.edit(form.value.firstname, form.value.lastname).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
      })
    }
  }

  editPassword(form: FormGroup) {
    if (form.value.currentPassword && form.value.newPassword) {
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Succesfully changed</b>.', '', {
        disableTimeOut: false,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-top-center'
      });
      this.editPasswordService.edit(form.value.currentPassword, form.value.newPassword).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
      })
    }
  }
  
  niz: any= [1];
  clcDiv: any = [false];

  openDiv(index1:number) {
    
    if(this.clcDiv[index1] == false) {
      this.clcDiv[index1] = true;
    }
    else {
      this.clcDiv[index1] = false;
    }
  }

  // showExperiments()
  // {
  //   this.userService.getAllUserExperiments().subscribe(exp =>{
  //     for(let i = 0; i< exp.length; i++)
  //     {
  //       let expData : any = {};
  //       expData = exp[i];
  //       this.data = expData;

  //       this.experiments.push(this.data)
  //     }
  //   })
  // }

  // deleteExperiments(id : any)
  // {
  //   this.userService.deleteExperiment(id).subscribe(res => {
  //     this.experiments = [];
  //     this.showExperiments();
  //   })
  //   location.reload();
  // }

}
