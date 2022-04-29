import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { TablesComponent } from "../../pages/tables/tables.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UploadComponent } from "../../pages/upload/upload.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { HomeComponent } from "src/app/pages/home/home.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgApexchartsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    TablesComponent,
    UploadComponent,
    HomeComponent
  ]
})
export class AdminLayoutModule {}
