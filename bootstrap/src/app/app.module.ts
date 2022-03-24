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
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserComponent } from "./pages/user/user.component";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { RegistrationLayoutComponent } from "./layouts/registration-layout/registration-layout.component";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

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
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent, 
    AdminLayoutComponent, 
    LoginLayoutComponent,
    RegistrationLayoutComponent, 
    UserComponent
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
