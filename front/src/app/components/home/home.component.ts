import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private cookie: CookieService) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.cookie.deleteAll();
    this.router.navigate(["/login"]);
  }
}
