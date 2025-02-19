import { Component,  OnInit, ViewChild } from "@angular/core"
import {  Router, RouterLink } from "@angular/router"
import { CustomizerSettingsService } from "../../customizer-settings/customizer-settings.service"
import { NgClass, NgIf } from "@angular/common"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import  { AuthService } from "../../../services/auth.service"
import  { AuthenticationRequest } from "../../models/authentication-request.model"
import {  RecaptchaComponent, RecaptchaModule } from "ng-recaptcha"
import  { TemporaryCredentialsService } from "../../../services/temporary-credentials.service"

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [RouterLink, NgClass, ReactiveFormsModule, NgIf, RecaptchaModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  @ViewChild("recaptcha") recaptcha: RecaptchaComponent | undefined

  isToggled = false
  loginForm: FormGroup
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
    private tempCredentialsService: TemporaryCredentialsService,
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled
    })

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      mathAnswer: ["", [Validators.required]],
      captcha: ["", Validators.required],
    })

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

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  onPasswordInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.password = inputElement.value
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse
    this.loginForm.get("captcha")?.setValue(captchaResponse)
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    const mathAnswer = this.loginForm.get("mathAnswer")?.value
    // @ts-ignore
    if (Number.parseInt(mathAnswer) !== this.mathEquation.answer) {
      this.showAlert("Réponse mathématique incorrecte. Veuillez réessayer.", "danger")
      this.generateMathEquation()
      return
    }

    const email = this.loginForm.value.email
    const password = this.loginForm.value.password

    this.authService.getUserByEmail(email).subscribe({
      next: (resp: any) => {
        const user = resp.data
        console.log("User fetched", user)
        if (user.enabled == false) {
          this.showAlert(
            "Votre session a été expirée. Veuillez renouveler votre session. Un email de confirmation vous a été envoyé.",
            "danger",
          )
        } else {
          if (user.authMethode === "EMAIL_VERIFICATION") {
            this.tempCredentialsService.storeCredentials(email, password)
            this.router.navigate(["/authentication/email-code-verification"], {
              queryParams: { email: user.email },
            })
          } else if (user.authMethode === "2FA_QR_CODE") {
            this.tempCredentialsService.storeCredentials(email, password, user.secret)
            this.router.navigate(["/authentication/scan-code-app"], {
              queryParams: { email: user.email },
            })
          } else {
            const request: AuthenticationRequest = {
              email: email,
              password: password,
              authMethode: user.authMethode,
            }
            this.authService.login(request).subscribe({
              next: (response: any) => {
                this.showAlert("Connexion réussie", "success")
                console.log("Login successful", response);
                sessionStorage.setItem("auth-user",JSON.stringify(user));
                setTimeout(() => this.router.navigate(["/dashboard"]), 2000)
              },
              error: (error: any) => {
                this.showAlert("Erreur de connexion: " + error.error.message, "danger")
                this.loginForm.reset()
                this.captcha = null
                this.loginForm.get("captcha")?.setValue(null)
                if (this.recaptcha) {
                  this.recaptcha.reset()
                }
                console.error("Login error", error)
              },
            })
          }
        }
      },
      error: (error) => {
        this.showAlert("Erreur de connexion: " + error.error.message, "danger")
        this.loginForm.reset()
        this.captcha = null
        this.loginForm.get("captcha")?.setValue(null)
        if (this.recaptcha) {
          this.recaptcha.reset()
        }
        console.error("Error fetching user:", error)
      },
    })

    // Générer une nouvelle équation après chaque tentative
    this.generateMathEquation()
  }

  ngOnInit(): void {
    this.generateMathEquation()
  }
}

