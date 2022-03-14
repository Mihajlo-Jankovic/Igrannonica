import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {


  public registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private library: LoginService, private cookie : CookieService, private router: Router) {
    this.registerForm = formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern("^[A-Za-z]{2,20}")]],
      lastname: ['', [Validators.required, Validators.pattern("^[A-Za-z]{2,20}")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$")]]
    })
   }

  ngOnInit(): void {
  }

  public get m(){
    return this.registerForm.controls;
  }

  registration(form: FormGroup)
  {
    if (form.value.username && form.value.password && form.value.firstname && form.value.lastname && form.value.email) {
        this.library.register(form.value.username, form.value.password,form.value.firstname,form.value.lastname,form.value.email)
        .subscribe(token => {
        let JSONtoken : string = JSON.stringify(token);
        let StringToken = JSON.parse(JSONtoken).token;
        if(StringToken == "Email is taken!")
          alert("Email vec postoji");
        else if(StringToken == "Username already exists!")
          alert("Korisnicko ime vec postoji");
        else{
          this.cookie.set("token", StringToken);
          this.router.navigate(['/login']);
        }
      }) 
    }
    else
    {
      alert("Popunite sva polja!");
    }
  }

}
