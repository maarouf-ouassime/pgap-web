import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthService } from "../../../services/auth.service";
import { RecaptchaComponent, RecaptchaModule } from "ng-recaptcha";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf, RecaptchaModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @ViewChild('recaptcha') recaptcha!: RecaptchaComponent;

  isToggled = false;
  signUpForm: FormGroup;
  password: string = '';
  isPasswordVisible: boolean = false;
  registrationSuccess = false;
  registrationError = false;
  errorMessage = '';
  captcha: string | null = '';

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });

    this.signUpForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      ]],
      captcha: ['', Validators.required]
    }, { validator: this.checkEmails });
  }

  checkEmails(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailsMismatch: true };
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
    this.signUpForm.get('captcha')?.setValue(captchaResponse);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.password = inputElement.value;
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const request: RegisterRequest = {
      firstname: this.signUpForm.value.firstname,
      lastname: this.signUpForm.value.lastname,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      authMethode: 'NORMAL'
    };

    this.authService.register(request).subscribe({
      next: (response: any) => {
        this.registrationSuccess = true;
        this.registrationError = false;
        this.signUpForm.reset();
        this.recaptcha.reset();
        setTimeout(() => this.registrationSuccess = false, 10000);
      },
      error: (error: any) => {
        console.log(error);
        this.registrationError = true;
        this.errorMessage = error.error?.message || "Erreur lors de l'inscription. Veuillez vérifier vos informations et réessayer.";
        this.signUpForm.reset();
        this.recaptcha.reset();
        this.signUpForm.get('captcha')?.setValue(null);
        setTimeout(() => this.registrationError = false, 5000);
      }
    });
  }
}
