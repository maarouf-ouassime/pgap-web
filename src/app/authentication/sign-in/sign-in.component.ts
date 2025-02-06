import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { AuthenticationRequest } from "../../models/authentication-request.model";
import { NgToastService } from "ng-angular-popup";
import {RecaptchaComponent, RecaptchaModule,} from "ng-recaptcha";
import {TemporaryCredentialsService} from "../../../services/temporary-credentials.service";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, NgClass, ReactiveFormsModule, NgIf, RecaptchaModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  @ViewChild('recaptcha') recaptcha: RecaptchaComponent | undefined;

  isToggled = false;
  loginForm: FormGroup;
  password: string = '';
  isPasswordVisible: boolean = false;
  captcha: string | null = '';
  email: string;

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private toastr: NgToastService,
    private router: Router,
    private authService: AuthService,
    private tempCredentialsService: TemporaryCredentialsService,
  ) {
    this.email = 'maaroufouassime@gmail.com';
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      captcha: ['', Validators.required] // Ajout de la validation du captcha
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.password = inputElement.value;
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
    // Mettez à jour le formulaire avec la réponse du captcha
    this.loginForm.get('captcha')?.setValue(captchaResponse);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.getUserByEmail(email).subscribe({
      next: (resp: any) => {
        let user = resp.data;
        console.log('User fetched', user);
        if (user.enabled == false) {
          this.toastr.danger('Votre session a été expirée. Veuillez renouveler votre session. une email de confirmation vous a été envoyé.', 'Session expirée', 10000);
        } else {
          // Vérifier la méthode d'authentification
          if (user.authMethode === 'EMAIL_VERIFICATION') {
            // Stocker les informations temporaires pour la vérification par email
            this.tempCredentialsService.storeCredentials(email, password);
            this.router.navigate(['/authentication/email-code-verification'], {
              queryParams: { email: user.email }
            });
          } else if (user.authMethode === '2FA_QR_CODE') {
            // Stocker les informations temporaires pour la vérification par code TFA
            this.tempCredentialsService.storeCredentials(email, password, user.secret);
            this.router.navigate(['/authentication/scan-code-app'], {
              queryParams: { email: user.email }
            });
          }else {
            const request: AuthenticationRequest = {
              email: email,
              password: password,
              authMethode: user.authMethode,
            };
            this.authService.login(request).subscribe({
              next: (response: any) => {
                this.toastr.success(response.message, 'Connexion réussie');
                console.log('Login successful', response);
                setTimeout(() => this.router.navigate(['/dashboard']), 2000);
              },
              error: (error: any) => {
                this.toastr.danger(error.error.message, 'Erreur de connexion');
                this.loginForm.reset();
                // Réinitialisation du captcha
                this.captcha = null; // Reset de la réponse captcha
                this.loginForm.get('captcha')?.setValue(null); // Nettoyer la valeur dans le formulaire
                if (this.recaptcha) {
                  this.recaptcha.reset(); // Réinitialiser le captcha
                }
                console.error('Login error', error);
              }
            });
          }
        }
      },
      error: (error) => {
        this.toastr.danger(error.error.message, 'Erreur de connexion');
        this.loginForm.reset();
        // Réinitialisation du captcha
        this.captcha = null; // Reset de la réponse captcha
        this.loginForm.get('captcha')?.setValue(null); // Nettoyer la valeur dans le formulaire
        if (this.recaptcha) {
          this.recaptcha.reset(); // Réinitialiser le captcha
        }
        console.error('Error fetching user:', error);
      }
    });
  }

  ngOnInit(): void { }
}
