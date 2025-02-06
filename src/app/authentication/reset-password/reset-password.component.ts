import { Component, OnInit } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { ResetPasswordRequest } from '../../models/reset-password-request.model';
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup"; // Import du modèle

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  isToggled = false;
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isPasswordVisible: boolean = false;

  // Messages d'erreur
  passwordError: string = '';
  confirmError: string = '';

  constructor(
    public themeService: CustomizerSettingsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: NgToastService,
  ) {}

  ngOnInit() {
    // Récupération du token depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  onSubmit(): void {
    this.passwordError = '';
    this.confirmError = '';

    // Validation du mot de passe
    if (!this.validatePassword(this.newPassword)) {
      this.passwordError = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmError = 'Les mots de passe ne correspondent pas';
      return;
    }

    // Appel du service
    const request: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
          this.toaster.success(response.message, 'Succès', 3000);
          setTimeout(() => this.router.navigate(['/authentication']), 3000);
      },
      error: (err) => {
        console.error('Failed to reset password', err);
        this.toaster.danger(err.error?.message || 'Failed to reset password', 'Erreur', 5000);
      }
    });
  }
}
