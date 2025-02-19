import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";
import {NgToastService} from "ng-angular-popup";
import {ResetPasswordRequest} from "../../models/reset-password-request.model";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;


  // isToggled
  isToggled = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private authService: AuthService,
    private toaster: NgToastService,
    private fb: FormBuilder,

  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
         });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
          this.toaster.success(response.message, 'Succès ', 5000);
      },
      error: (err) => {
        console.error('Failed to reset password', err);
        this.toaster.danger(err.error?.message, 'Erreur', 5000);
      }
    });
  }

}
