import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LandingComponent } from "./landing/landing.component";
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [LoginComponent, LandingComponent, ForgetPasswordComponent, TermsOfServiceComponent, PrivacyPolicyComponent],
  imports: [CommonModule, 
    SharedModule, 
    ReactiveFormsModule,
    FormsModule,],
  exports: [
    LoginComponent,
    LandingComponent,
    ForgetPasswordComponent
  ]
})
export class IndexModule {}
