import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Location } from "@angular/common";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


export const ROUTES: RouteInfo[] = [
  {
    path: "/home",
    title: "Home",
    icon: "fa fa-home",
    class: ""
  },
  {
    path: "/upload",
    title: "Upload",
    icon: "tim-icons icon-upload",
    class: ""
  },
  {
    path: "/datapreview",
    title: "Data Preview",
    icon: "tim-icons icon-bullet-list-67",
    class: ""
  },
  {
    path: "/training",
    title: "Model Training",
    icon: "tim-icons icon-chart-pie-36",
    class: ""
  },
  {
    path: "/experiments",
    title: "Experiments",
    icon: "tim-icons icon-single-copy-04",
    class: ""
  }
];
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  experimentName : string = "Unnamed experiment";

  constructor(private cookie : CookieService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.refreshExperimentName();
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
