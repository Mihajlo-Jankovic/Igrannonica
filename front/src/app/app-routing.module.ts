import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UploadComponent } from './components/upload/upload.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LoginService } from './services/login.service';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'table',
    component: TableComponent
  }


];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
