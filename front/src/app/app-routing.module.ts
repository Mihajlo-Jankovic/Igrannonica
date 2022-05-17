import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';  
import { Error404 } from "./layouts/error-404-page/error-404.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { RegistrationLayoutComponent } from "./layouts/registration-layout/registration-layout.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: "login",
    component: LoginLayoutComponent
  },
  {
    path: "register",
    component: RegistrationLayoutComponent
  },
  {
    path: "**",
    component: Error404 
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    TranslateModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
