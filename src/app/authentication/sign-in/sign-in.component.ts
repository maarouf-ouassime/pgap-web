import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour utiliser ngIf, ngFor, etc.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgToastModule,
  NgToastService,
  ToasterPosition,
} from 'ng-angular-popup';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ReactiveFormsModule,
    NgIf,
    RecaptchaModule,
    CommonModule,
    FormsModule,
    NgToastModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  // Formulaire réactif
  signInForm: FormGroup;
  submitted = false; // Variable pour suivre si le formulaire a été soumis
  isToggled = false;
  captchaResponse: string = ''; // Réponse du CAPTCHA
  message: string | null = '';
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
    private fb: FormBuilder, // Injection de FormBuilder
    private toast: NgToastService,
    private router: Router
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });

    // Initialisation du formulaire réactif avec validation
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validation du champ email
      password: ['', [Validators.required, Validators.minLength(6)]], // Validation du mot de passe
      captchaResponse: ['', Validators.required], // Ajouter un champ pour la réponse du CAPTCHA
    });
  }
  clearMessage() {
    this.message = null;
    this.isSuccess = false;
    this.isError = false;
  }

  ngOnInit(): void {
    this.generateSumQuestion(); // Générer une question de somme au chargement
  }

  // Method to display a message
  showMessage(message: string, isSuccess: boolean) {
    this.message = message;
    this.isSuccess = isSuccess;
    this.isError = !isSuccess;

    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  // Méthode pour gérer la réponse du CAPTCHA
  handleCaptchaResponse(response: string | null) {
    if (response) {
      this.captchaResponse = response; // Stocker la réponse du CAPTCHA
      this.signInForm.patchValue({ captchaResponse: response }); // Mettre à jour le formulaire
    } else {
      this.captchaResponse = ''; // Réinitialiser la réponse du CAPTCHA
      this.signInForm.patchValue({ captchaResponse: '' }); // Réinitialiser le formulaire
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
    this.submitted = true; // Marquer le formulaire comme soumis
    // Check if the form is invalid, CAPTCHA is not filled, or the sum is incorrect
    if (
      this.signInForm.invalid ||
      !this.captchaResponse ||
      !this.isSumCorrect()
    ) {
      this.showMessage('Please complete all fields correctly.', false);
      return;
    }
    // Vérifier si le formulaire est valide, si le CAPTCHA est rempli et si la somme est correcte

    // Récupérer les valeurs du formulaire
    const user = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password,
      captchaResponse: this.captchaResponse, // Réponse du CAPTCHA
    };

    // Call the authentication service
    this.authService.signIn(user).subscribe({
      next: (response) => {
        console.log('Backend response:', response);

        // Check if the response code is 200 and handle as success
        if (response && response.code === 200) {
          console.log('Connexion réussie', response);
          this.showMessage(response.message || 'Connexion réussie!', true);
          this.router.navigate(['/dashboard']); // Redirect to the dashboard
          // Perform further actions, e.g., saving the token or redirecting
        } else {
          // Handle unexpected cases
          console.error('Échec de la connexion (réponse inattendue)', response);
          this.showMessage(
            response.message || 'Une erreur inattendue est survenue.',
            false
          );
        }
      },
      error: (error) => {
        // Handle HTTP errors
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

  // showToast() {
  //   // Exemple d'utilisation
  //   this.toast.success('Opération réussie!', 'Succès', 5000);
  //   this.toast.danger('Opération échouée!', 'Erreur', 5000);
  //   this.toast.info('Information importante', 'Info', 5000);
  //   this.toast.warning('Attention!', 'Avertissement', 5000);
  // }
  // protected readonly ToasterPosition = ToasterPosition;
}
