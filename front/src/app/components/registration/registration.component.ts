import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  formModel = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: ""
  }
  constructor(private service: LoginService, private cookie : CookieService, private router: Router) { }

  ngOnInit(): void {
  }

  registration(form:NgForm)
  {
        this.service.register(form).subscribe(token => {
        this.cookie.set("token", token);
        this.router.navigate(['/login']);
      }) 
  }

  
}
