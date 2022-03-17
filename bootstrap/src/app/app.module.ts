import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { RegistrationLayoutRoutes } from "./layouts/registration-layout/registration-layout.routing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { RegistrationLayoutComponent } from "./layouts/registration-layout/registration-layout.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent, 
    AdminLayoutComponent, 
    LoginLayoutComponent,
    RegistrationLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
