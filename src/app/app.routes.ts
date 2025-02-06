import { Routes } from '@angular/router';
import {FrontPagesComponent} from "./front-pages/front-pages.component";
import {HomeComponent} from "./front-pages/home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthenticationComponent} from "./authentication/authentication.component";
import {SignInComponent} from "./authentication/sign-in/sign-in.component";
import {SignUpComponent} from "./authentication/sign-up/sign-up.component";
import {ForgotPasswordComponent} from "./authentication/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./authentication/reset-password/reset-password.component";
import {ConfirmEmailComponent} from "./authentication/confirm-email/confirm-email.component";
import {LockScreenComponent} from "./authentication/lock-screen/lock-screen.component";
import {LogoutComponent} from "./authentication/logout/logout.component";
import {
  EmailCodeVerificationComponent
} from "./authentication/email-code-verification/email-code-verification.component";
import {ScanCodeAppComponent} from "./authentication/scan-code-app/scan-code-app.component";
import {SurveyCreatorComponent} from "./dashboard/survey-creator/survey-creator.component";
import {SurveyFormComponent} from "./dashboard/survey-form/survey-form.component";

export const routes: Routes = [
  {
    path: '',
    component: FrontPagesComponent,
    children: [
      {path: '', component: HomeComponent},
      ]
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {path: '', component: SignInComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'confirm-email', component: ConfirmEmailComponent},
      {path: 'email-code-verification', component: EmailCodeVerificationComponent},
      {path: 'lock-screen', component: LockScreenComponent},
      {path: 'scan-code-app', component: ScanCodeAppComponent},
      {path: 'logout', component: LogoutComponent}
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: 'survey-creator', component: SurveyCreatorComponent},
      {path: 'survey-form', component: SurveyFormComponent},
    ]
  },
  {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list

];
