import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { Error404 } from "./layouts/error-404-page/error-404.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserComponent } from "./pages/user/user.component";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { RegistrationLayoutComponent } from "./layouts/registration-layout/registration-layout.component";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";
import { ExperimentsComponent } from './pages/experiments/experiments.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgApexchartsModule,
    RouterModule
  ],
  declarations: [
    AppComponent,
    Error404, 
    AdminLayoutComponent, 
    LoginLayoutComponent,
    RegistrationLayoutComponent, 
    UserComponent, ExperimentsComponent
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
