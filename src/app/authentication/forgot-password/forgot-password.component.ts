import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../services/auth.service'; // Importer AuthService
import { CommonModule } from '@angular/common'; // Importer CommonModule pour utiliser ngIf, ngFor, etc.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // Importer ReactiveFormsModule et FormBuilder

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule], // Ajouter ReactiveFormsModule
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  // isToggled
  isToggled = false;

  // Formulaire réactif
  forgotPasswordForm: FormGroup;

  // Messages pour l'utilisateur
  message: string = '';
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private authService: AuthService, // Injecter AuthService
    private fb: FormBuilder // Injecter FormBuilder
  ) {
    // Initialiser le formulaire
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validation de l'email
    });

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

  // Method to display a success or error message
  showMessage(message: string, isSuccess: boolean) {
    this.message = message;
    this.isSuccess = isSuccess;
    this.isError = !isSuccess;

    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
  // Méthode pour demander la réinitialisation du mot de passe
  onRequestReset() {
    // Réinitialiser les messages
    this.message = '';
    this.isSuccess = false;
    this.isError = false;

    // Vérifier si le formulaire est valide
    if (this.forgotPasswordForm.invalid) {
      this.message = 'Veuillez entrer une adresse email valide.';
      this.isError = true;
      return;
    }

    // Récupérer l'email du formulaire
    const email = this.forgotPasswordForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({
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
  }
}
