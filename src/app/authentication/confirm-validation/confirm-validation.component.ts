import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-confirm-validation',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgOtpInputModule],
  templateUrl: './confirm-validation.component.html',
  styleUrls: ['./confirm-validation.component.scss'],
})
export class ConfirmValidationComponent implements OnInit {
  // Déclarez la propriété message
  message: string = '';

  // Autres propriétés
  otp: string = '';
  confirmationMessage: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;
  isToggled = false;
  readonly OTP_LENGTH = 6;

  constructor(
    public themeService: CustomizerSettingsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
  }

  onOtpChange(otp: string): void {
    this.otp = otp;
    this.message = ''; // Réinitialiser le message
  }

  validateOtp(): void {
    if (this.otp.length === this.OTP_LENGTH) {
      this.isLoading = true;

      // Appeler le service pour confirmer la validation
      this.authService.confirmValidation(this.otp).subscribe(
        (response) => {
          this.isLoading = false;
          this.isSuccess = true;
          this.confirmationMessage = 'Validation réussie !';
          this.message =
            response.message || 'Votre compte a été validé avec succès.';
          this.router.navigate(['/authentication']); // Rediriger vers le tableau de bord
        },
        (error) => {
          this.isLoading = false;
          this.isSuccess = false;
          this.confirmationMessage =
            'Erreur lors de la validation. Veuillez réessayer.';
          this.message = error.error?.message || 'Une erreur est survenue.';
        }
      );
    } else {
      this.confirmationMessage = `Veuillez saisir un code OTP valide à ${this.OTP_LENGTH} chiffres.`;
    }
  }
}
