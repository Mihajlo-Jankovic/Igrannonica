import { Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from 'src/app/configuration';

@Component({
    selector: "app-home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.scss"]
})

export class HomeComponent implements OnInit {

    token: string;
    cookieCheck: any;
    configuration = new Configuration();

    constructor(private router: Router, private cookie : CookieService, private http: HttpClient) {
        this.cookieCheck = this.cookie.get('token');
    }
    
    ngOnInit() {
        if (this.cookieCheck) {
            this.refreshToken();
        }
    }

    refreshToken(){
        this.token = this.cookie.get('token');
        
        this.http.get<any>(this.configuration.refreshToken + this.token ).subscribe(token => {
            let JSONtoken: string = JSON.stringify(token);
            let StringToken = JSON.parse(JSONtoken).token;
            this.cookie.set("token", StringToken);
        }, err=>{
            let JSONtoken: string = JSON.stringify(err.error);
            let StringToken = JSON.parse(JSONtoken).token;
            if(StringToken == "Error: Token not valid"){
                this.onLogout();
                location.reload();
            }
        });
    }

    onLogout() {
        this.cookie.deleteAll();
        sessionStorage.clear();
        this.router.navigate(["home"]);
    }

    newExperiment() {
        this.cookie.set('home', 'true');
        this.router.navigate(['upload']);
    }

    oldExperiment() {
        this.cookie.set('home', 'true');
        this.router.navigate(['experiments']);
    }
}