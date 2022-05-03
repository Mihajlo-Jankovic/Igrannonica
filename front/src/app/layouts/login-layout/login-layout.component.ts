import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../components/sidebar/sidebar.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserInfoService } from 'src/app/services/edit/user-info.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  public loginForm: FormGroup;

  constructor( private toastr: ToastrService,private formBuilder: FormBuilder, private loginService: LoginService, private cookie: CookieService, private router: Router) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    })
  }

  ngOnInit(): void {
  }

  public get m() {
    return this.loginForm.controls;
  }

  save(username:string,password:string){
    sessionStorage.setItem('username',username);
    sessionStorage.setItem('password', password);
  }


  login(form: FormGroup) {
    if (form.value.username && form.value.password) {
      this.loginService.login(form.value.username, form.value.password).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        console.log(StringToken);
        if (StringToken == "Error: Username not found!"){
          this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Wrong username</b>.', '', {
            disableTimeOut: false,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: 'toast-top-center'
          });
        }
        else if (StringToken == "Error: Wrong password!"){
          this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Wrong password</b>.', '', {
            disableTimeOut: false,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: 'toast-top-center'
          });
        }
        else {
          this.save(form.value.username,form.value.password);
          this.cookie.set("token", StringToken);
          this.cookie.set("username",form.value.username);
          this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> <b>Successful login</b>.', '', {
            disableTimeOut: false,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: 'toast-top-center'
          });
          this.router.navigate(['upload']);
        }
      })
    }
  }
}
