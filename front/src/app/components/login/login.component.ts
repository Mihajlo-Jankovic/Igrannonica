import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:any;
  password: any;
  constructor(private loginService: LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  onLogin(loginForm:NgForm)
  {
    if(this.username && this.password){
      console.log(loginForm.value);
      this.router.navigate(["/home"]);
    }

   /* if(this.username && this.password) {
      this.loginService.login(this.username, this.password);
    }*/
  }

}
