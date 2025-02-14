import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  isToggled = false;
  isPassword1Visible: boolean = false;
  isPassword2Visible: boolean = false;
  message: string | null = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public themeService: CustomizerSettingsService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator() }
    );

    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  // Method to clear the message
  clearMessage(): void {
    this.message = '';
    this.isSuccess = false;
    this.isError = false;
  }
  // Show message method
  showMessage(message: string, isSuccess: boolean) {
    this.message = message;
    this.isSuccess = isSuccess;
    this.isError = !isSuccess;

    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  ngOnInit(): void {
    this.token =
      this.route.snapshot.queryParams['token'] ||
      localStorage.getItem('resetPasswordToken') ||
      '';
    console.log("Token récupéré depuis l'URL ou localStorage :", this.token);

    if (!this.token) {
      console.error('Token manquant');
      alert('Token manquant. Veuillez réessayer.');
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');

      return newPassword &&
        confirmPassword &&
        newPassword.value === confirmPassword.value
        ? null
        : { passwordMismatch: true };
    };
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'newPassword') {
      this.isPassword1Visible = !this.isPassword1Visible;
    } else if (field === 'confirmPassword') {
      this.isPassword2Visible = !this.isPassword2Visible;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          if (response && response.code === 200) {
            this.showMessage(response.message || 'Connexion réussie!', true);
          } else {
            this.showMessage(
              response.message || 'Une erreur inattendue est survenue.',
              false
            );
          }
        },
        error: (error) => {
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            'Une erreur est survenue. Veuillez réessayer.';
          this.showMessage(errorMessage, false);
        },
      });
    } else {
      console.log('Formulaire invalide ou token manquant');
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
