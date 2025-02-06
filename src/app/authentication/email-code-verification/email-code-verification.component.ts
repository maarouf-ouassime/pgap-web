import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../../services/auth.service';
import {NgIf} from "@angular/common";
import {VerificationRequest} from "../../models/verification-request.model";
import {AuthenticationRequest} from "../../models/authentication-request.model";
import {TemporaryCredentialsService} from "../../../services/temporary-credentials.service"; // Assurez-vous d'avoir ce service

@Component({
  selector: 'app-email-code-verification',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './email-code-verification.component.html',
  styleUrl: './email-code-verification.component.scss'
})
export class EmailCodeVerificationComponent implements OnInit{
  // États
  verificationSuccess = false;
  verificationError = false;
  errorMessage = '';
  email: string = ''; // Add email property


  // Formulaire de vérification
  verificationForm: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tempCredentialsService: TemporaryCredentialsService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    // Initialisation du formulaire
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'email depuis les queryParams et envoyer le code
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email', this.email);
      this.sendVerificationCode(); // Envoyer le code automatiquement
    });
  }

  sendVerificationCode(){
    const request: AuthenticationRequest = {
      email: this.email,
      authMethode: 'EMAIL_VERIFICATION'
    };
    // Appel du service pour vérifier le code
    this.authService.sendEmailCodeLogin(request).subscribe({
      next: (response) => {
        console.log('Verification code sent', response);
      },
      error: (error) => {
        console.error('Failed to send verification code', error);
      }
    });
  }


  // Soumission du formulaire
  onSubmit(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    const credentials = this.tempCredentialsService.getCredentials();
    if (!credentials) {
      console.error('No credentials found');
      return;
    }

    const request: AuthenticationRequest = {
      email: credentials.email,
      password: credentials.password,
      verificationCode: this.verificationForm.value.code,
      authMethode: 'EMAIL_VERIFICATION'
    };

    console.log('Verification request', request);

    this.tempCredentialsService.clearCredentials();

    // Appel du service pour vérifier le code
    this.authService.login(request).subscribe({
      next: (response) => {
        this.verificationSuccess = true;
        this.verificationError = false;

        // Redirection après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error: (error) => {
        this.verificationError = true;
        this.errorMessage = error.error?.message || 'Invalid verification code. Please try again.';
      }
    });
  }

  // Renvoyer le code
  resendCode(): void {
    this.sendVerificationCode();
  }
}
