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
    icon: "icon-tv-2",
    class: ""
  },
  {
    path: "/upload",
    title: "Upload",
    icon: "icon-upload",
    class: ""
  },
  {
    path: "/tables",
    title: "Data Preview",
    icon: "icon-bullet-list-67",
    class: ""
  },
  {
    path: "/dashboard",
    title: "Model Training",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/experiments",
    title: "Experiments",
    icon: "icon-single-copy-04",
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

  constructor(private cookie : CookieService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
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
}
