import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:any;
  password: any;
  constructor(private loginService: LoginService,private cookieService: CookieService, private router:Router) { }

  ngOnInit(): void {
  }

  onLogin(loginForm:NgForm)
  {
    if(this.username && this.password) {
      this.loginService.login(this.username, this.password).subscribe((token) => {
        if (token) {
          this.cookieService.set("token", token);
          this.router.navigate(["/home"]);
        }
        else {
          alert("Greska");
        }
      }
      )
    }
  }

}
