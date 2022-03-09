import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  
  {
    path: 'login',
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
