import { Routes } from '@angular/router';

import { LoginLayoutComponent } from './login-layout.component';
import { AuthGuardService } from 'src/app/services/auth-guard/auth-guard.service';


export const LoginLayoutRoutes: Routes = [
    { path: 'login',          component: LoginLayoutComponent, canActivate: [AuthGuardService] },
];
