import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginLayoutRoutes } from './login-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";

import { RtlComponent } from '../../pages/rtl/rtl.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LoginLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    RtlComponent,
  ]
})
export class LoginLayoutModule { }
