import { Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from 'src/app/configuration';
import { LanguageService } from "src/app/services/language.service";

@Component({
    selector: "app-home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.scss"]
})

export class HomeComponent implements OnInit {

    token: string;
    cookieCheck: any;
    configuration = new Configuration();
    public poruka : string;
    public message: string;

    constructor(public lang:LanguageService, private router: Router, private cookie : CookieService, private http: HttpClient) {
        this.cookieCheck = this.cookie.get('cortexToken');
    }
    
    

    ngOnInit() {
        this.lang.lanClickedEvent.subscribe((data:string) =>{
            this.message = data;
          });

        if (this.cookieCheck) {
            this.refreshToken();
        }
        sessionStorage.setItem('lastPage', 'home');
        this.cookie.delete('home');
    }

    refreshToken(){
        this.token = this.cookie.get('cortexToken');
        
        this.http.get<any>(this.configuration.refreshToken + this.token ).subscribe(token => {
            let JSONtoken: string = JSON.stringify(token);
            let StringToken = JSON.parse(JSONtoken).token;
            this.cookie.set("cortexToken", StringToken);
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
        this.router.navigate(['upload']);
    }

    oldExperiment() {
        this.router.navigate(['experiments']);
    }
}