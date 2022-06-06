import { Component, OnInit } from "@angular/core";
import { LanguageService } from "src/app/services/language.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"]
})
export class AdminLayoutComponent implements OnInit {
  public sidebarColor: string = "red";
  public message : string;

  constructor(public lang:LanguageService) {}

  ngOnInit() {

    this.lang.lanClickedEvent.subscribe((data:string) =>{
      this.message = data;
    });
  }

  changeSidebarColor(color){
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var mainPanel = document.getElementsByClassName('main-panel')[0];

    //this.sidebarColor = color;

    if(sidebar != undefined){
        //sidebar.setAttribute('data',color);
    }
    if(mainPanel != undefined){
        //mainPanel.setAttribute('data',color);
    }
  }
  changeDashboardColor(color){
    var body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
        body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
}
