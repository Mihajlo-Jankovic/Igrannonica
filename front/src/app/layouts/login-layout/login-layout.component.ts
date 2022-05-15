import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private notify: NotificationsService, private toastr: ToastrService, private formBuilder: FormBuilder, private loginService: LoginService, private cookie: CookieService, private router: Router) {
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
  }


  login(form: FormGroup) {
    if (form.value.username && form.value.password) {
      this.loginService.login(form.value.username, form.value.password).subscribe(token => {
        let JSONtoken: string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        
        this.save(form.value.username, form.value.password);
        this.cookie.set("token", StringToken);
        this.cookie.set("username", form.value.username);
        this.notify.showNotification("Successful login!");
        if(sessionStorage.getItem('lastPage')) {
          this.router.navigate([sessionStorage.getItem('lastPage')]);
        }
        else {
          this.router.navigate(['home']);
        }
      }, err => {
        let JSONtoken: string = JSON.stringify(err.error);
        let StringToken = JSON.parse(JSONtoken).responseMessage;
        console.log(StringToken);
        if (StringToken == "Error: Username not found!") {
          this.notify.showNotification("Wrong username!");
        }
        else if (StringToken == "Error: Wrong password!") {
          this.notify.showNotification("Wrong password!");
        }
      })
    }
    else {
      this.notify.showNotification("Please fill all fields.!");
    }
  }
}
