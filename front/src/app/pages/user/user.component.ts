import { Component, OnInit } from "@angular/core";
import { EditService } from "src/app/services/edit/edit.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditPasswordService } from "src/app/services/edit/edit-password.service";
import { UserInfoService } from "src/app/services/edit/user-info.service";
import { HttpClient } from "@angular/common/http";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "src/app/services/notifications.service";
import { LanguageService } from "src/app/services/language.service";


@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.scss"]
})
export class UserComponent implements OnInit {

  data = {
    'name': "",
    'fileName': "",
    'inputList': [],
    'output': "",
    'problemType': "",
    'encodingType': "",
    'optimizer': "",
    'regularization': "",
    'lossFunction': "",
    'ratio': 0,
    'activationFunction': "",
    'learningRate': 0,
    'regularizationRate': 0,
    'epochs': 0,
    'numLayers': 0,
    'layerList': [],
    'metrics': []
  }

  public editForm: FormGroup;
  public editPasswordForm: FormGroup;

  experiments: any = []

  username: string;
  indicatorInfo: boolean = false;
  indicatorPassword: boolean = false;
  userInfo: any;

  public poruka: string;
  public message: string;

  getUsername() {
    return sessionStorage.getItem('username');
  }

  constructor(public lang:LanguageService,private notify: NotificationsService, private toastr: ToastrService, private userInfoService: UserInfoService, private editService: EditService, private editPasswordService: EditPasswordService, private formBuilder: FormBuilder, private userService: UserService) {
    this.editForm = formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern("^[A-Za-z]{2,20}")]],
      lastname: ['', [Validators.required, Validators.pattern("^[A-Za-z]{2,20}")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    });
    this.editPasswordForm = formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]],
      newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]],
      confirmNewPassword: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    });
  }

  ngOnInit() {
    this.lang.lanClickedEvent.subscribe((data:string) =>{
      this.message = data;
    });

    this.message = sessionStorage.getItem("lang");

    sessionStorage.setItem('lastPage', 'profile');
    this.getInfo();
  }

  getInfo() {
    this.userInfo = this.userInfoService.info().subscribe(data => {
      this.userInfo = data;
    })
  }

  public get m() {
    return this.editForm.controls;
  }
  public get n() {
    return this.editPasswordForm.controls;
  }

  editInfo() {
    if (this.indicatorInfo == true)
      this.indicatorInfo = false;
    else {
      this.indicatorInfo = true;
      this.indicatorPassword = false;
    }
  }
  changePassword() {
    if (this.indicatorPassword == true)
      this.indicatorPassword = false;
    else {
      this.indicatorPassword = true;
      this.indicatorInfo = false;
    }
  }


  edit(form: FormGroup) {
    if (form.value.firstname && form.value.lastname && form.value.password ) {
      {
        this.editService.edit(form.value.firstname, form.value.lastname, form.value.password).subscribe(async token => {
          let JSONtoken: string = JSON.stringify(token);
          this.poruka = "Succesfully changed!";
          if(this.message == "sr")this.poruka = "Uspešno promenjeno";
          this.notify.showNotification(this.poruka);
          await new Promise(f => setTimeout(f, 50));
          this.getInfo();
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error: Wrong password!") {
            this.poruka = "Wrong password!";
            if(this.message == "sr")this.poruka = "Pogrešna lozinka";
            this.notify.showNotification(this.poruka);
          }
        })
      }
    }
  }

  editPassword(form: FormGroup) {
    if (form.value.currentPassword && form.value.newPassword && form.value.confirmNewPassword) {
      if (form.value.newPassword != form.value.confirmNewPassword) {
        this.poruka = "Password mismatched!";
        if(this.message == "sr")this.poruka= "Lozinke se ne poklapaju"
        this.notify.showNotification(this.poruka);
      }
      else {
        this.editPasswordService.edit(form.value.currentPassword, form.value.newPassword).subscribe(async token => {
          let JSONtoken: string = JSON.stringify(token);
          this.poruka = "Succesfully changed!";
          if(this.message == "sr")this.poruka = "Usešno promenjeno";
          this.notify.showNotification(this.poruka);
          await new Promise(f => setTimeout(f, 50));
          this.getInfo();
        }, err => {
          let JSONtoken: string = JSON.stringify(err.error);
          let StringToken = JSON.parse(JSONtoken).responseMessage;
          if (StringToken == "Error: Wrong password!") {
            this.poruka = "Wrong password!";
            if(this.message == "sr")this.poruka = "Pogrešna lozinka";
            this.notify.showNotification(this.poruka);
          }
        })
      }
    }
  }

}
