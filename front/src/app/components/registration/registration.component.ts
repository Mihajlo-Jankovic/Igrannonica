import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  name: any;
  surname: any;
  email: any;
  username: any;
  password: any;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  registration()
  {
    if(this.name && this.surname && this.username && this.password)
    {
        
        this.router.navigate(['/login']);
    }
    else
    {
      alert("Popunite sva polja!");
    }
  }
}
