import { Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: "app-home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.scss"]
})

export class HomeComponent implements OnInit {

    constructor(private router: Router, private cookie : CookieService) {}
    
    ngOnInit() {
        
    }

    newExperiment() {
        this.cookie.set('home', 'true');
        this.router.navigate(['upload']);
    }

    useExperiment(){
        this.cookie.set('home', 'true');
        this.router.navigate(['experiments']);
    }
}