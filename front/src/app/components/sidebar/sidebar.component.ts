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
  }
];



@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  location: Location;
  private listTitles: any[];
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

  isUploaded(name)
  {
    if(name == 'Upload')
      return true;
    else{
    if(this.cookie.get('filename'))
      return true;
    return false;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "//") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
}
