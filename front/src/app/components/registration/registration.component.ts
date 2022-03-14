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
        let JSONtoken : string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        if(StringToken == "Username already exists!")
          alert("korisnicko ime vec postoji");
        else if(StringToken == "Email is taken!")
          alert("email vec postoji");
        else{
          this.cookie.set("token", StringToken);
          this.router.navigate(['/login']);
        }
      }) 
    
  }

  
}
