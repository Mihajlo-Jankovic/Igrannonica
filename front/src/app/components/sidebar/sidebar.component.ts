import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Location } from "@angular/common";

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

  public lang: string;
  public home: string;

  public ind: boolean = false;


  constructor(private cookie : CookieService) {
    this.lang = sessionStorage.getItem('lang');
    
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.refreshExperimentName();

    if(this.lang == 'sr')
      this.ind = true;
  }

  refreshExperimentName() {
    if(sessionStorage.getItem('experimentName')) {
      this.experimentName = sessionStorage.getItem('experimentName');
    }
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
      if(this.cookie.get('filename'))
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
