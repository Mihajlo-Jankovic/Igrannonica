import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Configuration } from 'src/app/configuration';
import { EditPasswordService } from 'src/app/services/edit/edit-password.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  public loginForm: FormGroup;
  public disableButton: boolean = false;
  public tempPasswordForm: FormGroup;
  public changePasswordForm: FormGroup;
  public searchEmailForm: FormGroup;
  public validateEmailForm: FormGroup;

  public forgotPasswordIndicator: boolean;
  public temporaryPasswordIndicator: boolean;
  public newPasswordIndicator: boolean;
  public validateEmailIndicator: boolean;

  public tempUsername: any;
  public tempPass: any;

  public poruka: string;

  public validateEmailWarning: boolean = false;

  configuration = new Configuration();

  constructor(private notify: NotificationsService, private toastr: ToastrService, private formBuilder: FormBuilder,  private loginService: LoginService, private editPasswordService: EditPasswordService, private cookie: CookieService, private router: Router, private http: HttpClient) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    })

    this.searchEmailForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    })
    this.changePasswordForm = formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    })
    this.tempPasswordForm = formBuilder.group({
      temporaryPassword: ""
    })
    this.validateEmailForm = formBuilder.group({
      email:"",
      code:""
    })
  }

  ngOnInit(): void {
    this.forgotPasswordIndicator = false;
  }

  public get m() {
    return this.loginForm.controls;
  }

  save(username:string,password:string){
    sessionStorage.setItem('username',username);
  }

  forgotPassword() {
    this.forgotPasswordIndicator = true;
    this.temporaryPasswordIndicator = false;
    this.newPasswordIndicator = false;
    this.validateEmailIndicator = false;
  }

  createTemporaryPassword() {
    this.forgotPasswordIndicator = false;
    this.temporaryPasswordIndicator = true;
    this.newPasswordIndicator = false;
    this.validateEmailIndicator = false;
  }

  backToLogin() {
    this.forgotPasswordIndicator = false;
    this.newPasswordIndicator = false;
    this.validateEmailIndicator = false;
    this.validateEmailWarning = false;
  }

  createNewPassword() {
    this.forgotPasswordIndicator = false;
    this.temporaryPasswordIndicator = false;
    this.newPasswordIndicator = true;
    this.validateEmailIndicator = false;
  }

  validateEmail(){
    this.forgotPasswordIndicator = false;
    this.temporaryPasswordIndicator = false;
    this.newPasswordIndicator = false;
    this.validateEmailIndicator = true;
    this.validateEmailWarning = false;
  }

  emailCode(form:FormGroup){
    if(form.value.code){
      console.log(form.value.email);
      this.loginService.verifyMail(form.value.code,form.value.email).subscribe(token=>{
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        this.backToLogin();
      },err=>{
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;
        if (StringToken == "Error: Username not found!") { 
          this.poruka = "Username not found";

          // this.poruka = "Korisničko ime ne postoji"
          this.notify.showNotification(this.poruka);
        }
        else if (StringToken == "Error: Wrong number!") {
          this.poruka = "Wrong code";
          // this.poruka = "Pogrešan kod"
          this.notify.showNotification(this.poruka);
        }
        else if (StringToken == "Error: Mail already verified!") {
          this.poruka = "Mail already verified!";
          // this.poruka = "Email je već verifikovan"
          this.notify.showNotification(this.poruka);
        }

      }) 
      
    }
  }



  login(form: FormGroup) {
    if (form.value.username && form.value.password) {
      this.loginService.login(form.value.username, form.value.password).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;

        this.save(form.value.username, form.value.password);
        this.cookie.set("cortexToken", StringToken);
        this.cookie.set("username", form.value.username);
        this.poruka = "Successful login";
        // this.poruka = "Uspešno ste se prijavili"
        this.notify.showNotification(this.poruka);
        this.router.navigate([sessionStorage.getItem('lastPage')]);

      }, err => {

        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;

        if (StringToken == "Error: Wrong password!") {
          this.poruka = "Wrong password";
          // this.poruka = "Pogrešna lozinka"
          this.notify.showNotification(this.poruka);
        }
        else if (StringToken == "Error: Username not found!") {
          this.poruka = "Wrong username";
          // this.poruka = "Pogrešno korisničko ime"
          this.notify.showNotification(this.poruka);
        }
        else if (StringToken == "Error: You have to verify your mail!") {
          this.poruka = "You have to verify your mail!";
          // this.poruka = "Morate verifikovati email"
          this.notify.showNotification(this.poruka);
          this.validateEmailWarning = true;
        }
      })
    }
    else {
      this.poruka = "Please fill all fields.";
       // this.poruka = "Popunite sva polja"
      this.notify.showNotification(this.poruka);
    }
  }

  saveTempPassword(form: FormGroup) {
    this.tempPass = form.value.temporaryPassword;
    this.createNewPassword();
  }
  
  tempPassword(form: FormGroup) {
    if (form.value.email) {
      this.loginService.resetPassword(form.value.email).subscribe((response: any) => {
        let JSONtoken: string = JSON.stringify(response);
        let StringToken = JSON.parse(JSONtoken).username;

        this.createTemporaryPassword();
        this.tempUsername = StringToken;
      }, err => {
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;
        if (StringToken == "There is no user with this email.")
        this.poruka = "There is no user with this email";
         // this.poruka = "Ne postoji korisnik sa unetim email-om"
        this.notify.showNotification(this.poruka);
      })
    }
  }

  changePassword(form: FormGroup) {
      this.loginService.edit(this.tempPass, form.value.newPassword).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        if (form.value.newPassword) {
          this.poruka = "Succesfully changed";
           // this.poruka = "Lozinka je uspešno promenjena"
          this.notify.showNotification(this.poruka);
        }
        this.backToLogin();
      },err=>{
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;
        if(StringToken == "Wrong password"){
          this.poruka = "Temporary password is wrong";
           // this.poruka = "Pogrešna privremena lozinka"
          this.notify.showNotification(this.poruka);
        }
      })
    
  }


}
