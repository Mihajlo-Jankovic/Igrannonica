import { Component, OnInit, Input } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Location } from "@angular/common";
import { HomeComponent } from "src/app/pages/home/home.component";
import { ExpNameService } from "src/app/services/expName.service";
import { LanguageService } from "src/app/services/language.service";
import { waitForAsync } from "@angular/core/testing";
import { delay } from "rxjs";
import { EventEmitter, Injectable, Output } from '@angular/core';

declare interface RouteInfo {
  path: string;
  titleEn: string;
  titleSr: string;
  icon: string;
  class: string;
}


export const ROUTES: RouteInfo[] = [
  {
    path: "/home",
    titleEn: "Home",
    titleSr: "Pocetna",
    icon: "fa fa-home",
    class: ""
  },
  {
    path: "/upload",
    titleEn: "Upload",
    titleSr: "Ucitavanje fajla",
    icon: "tim-icons icon-upload",
    class: ""
  },
  {
    path: "/datapreview",
    titleEn: "Data Preview",
    titleSr:"Pregled podataka",
    icon: "tim-icons icon-bullet-list-67",
    class: ""
  },
  {
    path: "/training",
    titleEn: "Model Training",
    titleSr: "Obuka modela",
    icon: "tim-icons icon-chart-pie-36",
    class: ""
  },
  {
    path: "/experiments",
    titleEn: "Experiments",
    titleSr: "Eksperimenti",
    icon: "tim-icons icon-single-copy-04",
    class: ""
  },

  
];
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  experimentName : string = "Unnamed experiment";
  filename : string = "";

  public lang: string;
  public home: string;
  public lang3:string;

  

  public homePath = "/home";
  public uploadPath = "/upload";
  public experimentsPath = "/experiments";

  public ind: boolean = false;
  constructor(public cookie : CookieService, private expName : ExpNameService, private lang2 : LanguageService) {
    this.lang = sessionStorage.getItem('lang');

  }
  message:string;
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    if(sessionStorage.getItem('experimentName'))
      this.experimentName = sessionStorage.getItem('experimentName');
    if(sessionStorage.getItem('filename'))
      this.filename = sessionStorage.getItem('filename');
    this.expName.aClickedEvent.subscribe((data:string) => {
      this.experimentName = data;
    });
    this.expName.fileClickedEvent.subscribe((data:string) =>{
      this.filename = data;
    });
    if(this.lang == 'sr')
      this.ind = true;

      this.lang2.lanClickedEvent.subscribe((data:string) =>{
        this.message = data;
        if(this.message == "sr"){
          if(this.experimentName = "Unnamed experiment"){
            this.experimentName = "Neimenovani eksperiment";
          }
        }
      });
    //   this.message = this.lang2.getMessage();
    // console.log("side "+this.message);

      // this.lang2.languageClickedEvent.subscribe((data:string) => {
      //      this.lang = data;
      // });
  }


  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  notSelected(name)
  {
    if(name == "Home")
    {
      if(this.cookie.get('home'))
        return false;
      else
        return true;
    }
    else if(name == "Upload")
    {
      if(!this.cookie.get('home'))
        return false;
      else
        return true;
    }
    else if(name == "Experiments")
    {
      if(!this.cookie.get('home'))
        return false;
      else
        return true;
    }
    else
    {
      if(sessionStorage.getItem('filename'))
        return true;
      else
        return false;
    }
  }

  hide() {
    if(sessionStorage.getItem('lastPage') && sessionStorage.getItem('lastPage') == 'home') {
      return true;
    }
    else {
      return false;
    }
  }

}
