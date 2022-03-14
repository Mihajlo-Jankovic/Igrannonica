import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  /*username: string;
  password: string;*/

  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private library: LoginService, private cookie: CookieService, private router: Router) {
    this.loginForm = formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    })
   }

  ngOnInit(): void {

  }

  public get m(){
    return this.loginForm.controls;
  }

  login(form: FormGroup) {
    if (form.value.username && form.value.password) {
      this.library.login(form.value.username, form.value.password).subscribe(token => {
        let JSONtoken : string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        if(StringToken == "User not found")
          alert("pogresno korisnicko ime");
        else if(StringToken == "Wrong password")
          alert("pogresna sifra");
        else
        {
          this.cookie.set("token",StringToken);
          this.router.navigate(['/home']);
        }
      })
    }
    else
    {
      alert("Popunite sva polja!");
    }
  }
  
}

