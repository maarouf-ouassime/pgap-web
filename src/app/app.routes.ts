import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { ConfirmValidationComponent } from './authentication/confirm-validation/confirm-validation.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { UsersListComponent } from './users-page/users-list/users-list.component';
import { AddUserComponent } from './users-page/add-user/add-user.component';
import { TeamMembersComponent } from './users-page/team-members/team-members.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        component: UsersPageComponent,
        children: [
          { path: '', component: TeamMembersComponent },
          { path: 'users-list', component: UsersListComponent },
          { path: 'add-user', component: AddUserComponent },
        ],
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'confirm-email', component: ConfirmEmailComponent },
      { path: 'confirm-validation', component: ConfirmValidationComponent },
    ],
  },
  { path: '**', component: NotFoundComponent }, // This line will remain down from the whole pages component list
];
