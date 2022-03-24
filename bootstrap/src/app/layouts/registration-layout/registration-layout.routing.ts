import { Routes } from '@angular/router';

import { RegistrationLayoutComponent } from './registration-layout.component';
import { AuthGuardService } from 'src/app/services/auth-guard/auth-guard.service';


export const RegistrationLayoutRoutes: Routes = [
    { path: 'register',          component: RegistrationLayoutComponent, canActivate: [AuthGuardService] },
];
