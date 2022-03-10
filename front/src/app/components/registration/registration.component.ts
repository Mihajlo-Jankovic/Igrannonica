import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  firstname: any;
  lastname: any;
  email: any;
  username: any;
  password: any;

  constructor(private service: UserService, private cookie : CookieService, private router: Router) { }

  ngOnInit(): void {
  }

  registration()
  {
    if(this.firstname && this.lastname && this.email && this.username && this.password)
    {
        this.service.register(this.firstname, this.lastname, this.email, this.username, this.password).subscribe(token => {
        this.cookie.set("token", token);
        this.router.navigate(['/login']);
      })
    }
    else
    {
      alert("Popunite sva polja!");
    }
  }
  
}
