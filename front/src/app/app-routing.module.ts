import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { RegistrationLayoutComponent } from "./layouts/registration-layout/registration-layout.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "upload",
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
    path: "",
    component: LoginLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./layouts/login-layout/login-layout.module").then(m => m.LoginLayoutModule)
      }
    ]
  },
  {
    path: "",
    component: RegistrationLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./layouts/registration-layout/registration-layout.module").then(m => m.RegistrationLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "upload"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
