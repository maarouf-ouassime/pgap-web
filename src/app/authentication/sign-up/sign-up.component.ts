import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ReactiveFormsModule,
    NgIf,
    RecaptchaModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  // Formulaire réactif
  signUpForm: FormGroup;
  submitted = false; // Variable pour suivre si le formulaire a été soumis
  isToggled = false;
  captchaResponse: string = ''; // Réponse du CAPTCHA
  // New properties for the message
  message: string = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  // Variables pour la somme
  num1: number = 0;
  num2: number = 0;
  userSumResponse: number | null = null; // Réponse de l'utilisateur
  correctSum: number = 0; // Somme correcte

  constructor(
    public themeService: CustomizerSettingsService,
    public authService: AuthService,
    private fb: FormBuilder // Injection de FormBuilder
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });

    // Initialisation du formulaire réactif avec validation
    this.signUpForm = this.fb.group(
      {
        firstname: ['', Validators.required], // Prénom
        lastname: ['', Validators.required], // Nom
        email: ['', [Validators.required, Validators.email]], // Email
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]], // Mot de passe
        captchaResponse: ['', Validators.required],
        photo: [null], // Photo de profil
      },
      { validators: this.emailMatchValidator.bind(this) } // Ajoute le validateur personnalisé
    );
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.signUpForm.patchValue({ photo: file });
    }
  }

  // Method to clear the message
  clearMessage(): void {
    this.message = '';
    this.isSuccess = false;
    this.isError = false;
  }
  // Method to display a success or error message
  showMessage(content: string, isSuccess: boolean): void {
    this.message = content;
    this.isSuccess = isSuccess;
    this.isError = !isSuccess;

    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
  // Validateur personnalisé pour vérifier que les emails correspondent
  emailMatchValidator(formGroup: FormGroup) {
    const email = formGroup.get('email')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;

    if (email !== confirmEmail) {
      formGroup.get('confirmEmail')?.setErrors({ emailMismatch: true });
    } else {
      formGroup.get('confirmEmail')?.setErrors(null);
    }
  }

  ngOnInit(): void {
    this.generateSumQuestion(); // Générer une question de somme au chargement
  }

  // Méthode pour gérer la réponse du CAPTCHA
  handleCaptchaResponse(response: string | null) {
    if (response) {
      this.captchaResponse = response; // Stocker la réponse du CAPTCHA
      this.signUpForm.patchValue({ captchaResponse: response }); // Mettre à jour le formulaire
    } else {
      this.captchaResponse = ''; // Réinitialiser la réponse du CAPTCHA
      this.signUpForm.patchValue({ captchaResponse: '' }); // Réinitialiser le formulaire
    }
  }

  // Méthode pour générer une question de somme
  generateSumQuestion() {
    this.num1 = Math.floor(Math.random() * 10); // Nombre aléatoire entre 0 et 9
    this.num2 = Math.floor(Math.random() * 10); // Nombre aléatoire entre 0 et 9
    this.correctSum = this.num1 + this.num2; // Calculer la somme correcte
  }

  // Méthode pour vérifier la réponse de l'utilisateur
  isSumCorrect(): boolean {
    return this.userSumResponse === this.correctSum;
  }

  // Méthode de soumission du formulaire
  onSubmit() {
    this.submitted = true; // Mark the form as submitted

    // Check if the form is invalid, CAPTCHA is not filled, or the sum is incorrect
    if (
      this.signUpForm.invalid ||
      !this.captchaResponse ||
      !this.isSumCorrect() ||
      this.signUpForm.hasError('emailMismatch')
    ) {
      return;
    }

    // Create FormData to send the form data and the file
    const formData = new FormData();
    formData.append('firstname', this.signUpForm.value.firstname);
    formData.append('lastname', this.signUpForm.value.lastname);
    formData.append('email', this.signUpForm.value.email);
    formData.append('password', this.signUpForm.value.password);
    formData.append('captchaResponse', this.captchaResponse);
    if (this.signUpForm.value.photo) {
      formData.append('photo', this.signUpForm.value.photo);
    }

    // Call the signup service to submit the FormData
    this.authService.signUp(formData).subscribe({
      next: (response) => {
        console.log('Backend response:', response);

        // Check if the response code is 200 and handle as success
        if (response && response.code === 200) {
          console.log('Connexion réussie', response);
          this.showMessage(response.message || 'Connexion réussie!', true);
        } else {
          console.error('Échec de la connexion (réponse inattendue)', response);
          this.showMessage(
            response.message || 'Une erreur inattendue est survenue.',
            false
          );
        }
      },
      error: (error) => {
        console.error('Erreur lors de la connexion', error);
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          'Une erreur est survenue. Veuillez réessayer.';
        this.showMessage(errorMessage, false);
      },
    });
  }

  // Password Show/Hide
  password: string = '';
  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.password = inputElement.value;
  }
}
