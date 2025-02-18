import { Component, ViewChild,  OnInit } from "@angular/core"
import {Router, RouterLink} from "@angular/router"
import  { CustomizerSettingsService } from "../../customizer-settings/customizer-settings.service"
import { NgClass, NgIf } from "@angular/common"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import  { RegisterRequest } from "../../models/register-request.model"
import  { AuthService } from "../../../services/auth.service"
import {  RecaptchaComponent, RecaptchaModule } from "ng-recaptcha"

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf, RecaptchaModule, RouterLink],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent implements OnInit {
  @ViewChild("recaptcha") recaptcha!: RecaptchaComponent

  isToggled = false
  signUpForm: FormGroup
  password = ""
  isPasswordVisible = false
  captcha: string | null = ""
  mathEquation: { num1: number; num2: number; answer: number } | undefined
  alertMessage = ""
  alertType: "success" | "danger" | "" = ""

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled
    })

    this.signUpForm = this.fb.group(
      {
        firstname: ["", [Validators.required]],
        lastname: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        confirmEmail: ["", [Validators.required]],
        password: [
          "",
          [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)],
        ],
        mathAnswer: ["", [Validators.required]],
        captcha: ["", Validators.required],
      },
      { validator: this.checkEmails },
    )

    this.generateMathEquation()
  }

  ngOnInit(): void {
    this.generateMathEquation()
  }

  generateMathEquation() {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    this.mathEquation = {
      num1,
      num2,
      answer: num1 + num2,
    }
  }

  checkEmails(group: FormGroup) {
    const email = group.get("email")?.value
    const confirmEmail = group.get("confirmEmail")?.value
    return email === confirmEmail ? null : { emailsMismatch: true }
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse
    this.signUpForm.get("captcha")?.setValue(captchaResponse)
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.password = inputElement.value
  }

  showAlert(message: string, type: "success" | "danger") {
    this.alertMessage = message
    this.alertType = type
    setTimeout(() => {
      this.alertMessage = ""
      this.alertType = ""
    }, 5000)
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched()
      return
    }

    const mathAnswer = this.signUpForm.get("mathAnswer")?.value
    // @ts-ignore
    if (Number.parseInt(mathAnswer) !== this.mathEquation.answer) {
      this.showAlert("Réponse mathématique incorrecte. Veuillez réessayer.", "danger")
      this.generateMathEquation()
      return
    }

    const request: RegisterRequest = {
      firstname: this.signUpForm.value.firstname,
      lastname: this.signUpForm.value.lastname,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      authMethode: "NORMAL",
    }

    this.authService.register(request).subscribe({
      next: (response: any) => {
        this.showAlert(
          "Inscription réussie ! Veuillez vérifier votre boîte email et cliquer sur le lien de validation que nous venons de vous envoyer pour activer votre compte.",
          "success",
        )
        this.signUpForm.reset()
        this.recaptcha.reset()
      },
      error: (error: any) => {
        console.log(error)
        this.showAlert(
          error.error?.message || "Erreur lors de l'inscription. Veuillez vérifier vos informations et réessayer.",
          "danger",
        )
        this.signUpForm.reset()
        this.recaptcha.reset()
        this.signUpForm.get("captcha")?.setValue(null)
      },
    })

    // Générer une nouvelle équation après chaque tentative
    this.generateMathEquation()
  }
}

