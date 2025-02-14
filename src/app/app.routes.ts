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
import {FeaturesComponent} from "./front-pages/features/features.component";
import {TeamComponent} from "./front-pages/team/team.component";
import {ContactComponent} from "./front-pages/contact/contact.component";
import {FaqComponent} from "./front-pages/faq/faq.component";
import {SurveyResponseViewComponent} from "./dashboard/survey-response-view/survey-response-view.component";

export const routes: Routes = [
  {
    path: '',
    component: FrontPagesComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'features', component: FeaturesComponent},
      {path: 'team', component: TeamComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'contact', component: ContactComponent}
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
      {path: 'survey-form/:id', component: SurveyFormComponent},
      {path: 'survey-response-view/:id', component: SurveyResponseViewComponent},
    ]
  },
  {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list

];
