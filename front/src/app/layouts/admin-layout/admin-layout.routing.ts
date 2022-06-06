import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { UploadComponent } from "../../pages/upload/upload.component";
import { UploadGuardService } from "src/app/services/upload-guard.service";
import { NoAuthGuardService } from "src/app/services/auth-guard/no-auth-guard.service";
import { HomeComponent } from "src/app/pages/home/home.component";
import { ExperimentsComponent } from "src/app/pages/experiments/experiments.component";

export const AdminLayoutRoutes: Routes = [
  { path: "training", component: DashboardComponent, canActivate:[UploadGuardService] },
  { path: "profile", component: UserComponent, canActivate : [NoAuthGuardService] },
  { path: "datapreview", component: TablesComponent, canActivate:[UploadGuardService] },
  { path : "upload", component : UploadComponent},
  { path : "home", component : HomeComponent},
  { path : "experiments", component : ExperimentsComponent}
];


