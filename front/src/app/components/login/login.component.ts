import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /*
    username: any;
    password: any;
    invalidLogin: boolean;
    //constructor(public service: UserService, private cookieService: CookieService, private router:Router) { }
    constructor(private router: Router, private http: HttpClient) {}
  
    ngOnInit(): void {
    }
  
    /*onLogin1()
    {
      if(this.username && this.password) 
      {
          this.service.login(this.username, this.password).subscribe((token) => {
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
  
    onLogin(form: NgForm) {
      const credentials = {
          'username' : form.value.username,
          'password' : form.value.password
      }
  
      this.http.post("https://localhost:7219/api/User/login", credentials)
          .subscribe(response => {
              const token = (<any>response).token;
              localStorage.setItem("jwt", token);
              this.invalidLogin = false;
              this.router.navigate(["/"]);
          }, err => {
              this.invalidLogin = true;
          })
      }
  
      */

  username: string;
  password: string;
  constructor(private library: LoginService, private cookie: CookieService, private router: Router) { }

  ngOnInit(): void {

  }

  login() {
    if (this.username && this.password) {
      this.library.login(this.username, this.password).subscribe(token => {
        this.cookie.set("token", token);
        this.router.navigate(['/home']);
      })
    }
    else
    {
      alert("Pogresno korisnicko ime ili lozinka.");
    }
  }
  
}

