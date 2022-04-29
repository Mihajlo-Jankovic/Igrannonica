import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { UploadComponent } from "../../pages/upload/upload.component";
import { UploadGuardService } from "src/app/services/upload-guard.service";
import { NoAuthGuardService } from "src/app/services/auth-guard/no-auth-guard.service";
import { HomeComponent } from "src/app/pages/home/home.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate:[UploadGuardService] },
  { path: "user", component: UserComponent, canActivate : [NoAuthGuardService] },
  { path: "tables", component: TablesComponent, canActivate:[UploadGuardService] },
  { path : "upload", component : UploadComponent},
  { path : "home", component : HomeComponent}
];


