import { Component,  OnInit, ViewChild } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import {  ActivatedRoute,  Router, RouterLink } from "@angular/router"
import { NgOtpInputModule,  NgOtpInputComponent } from "ng-otp-input"
import  { CustomizerSettingsService } from "../../customizer-settings/customizer-settings.service"
import  { AuthService } from "../../../services/auth.service"
import { NgIf } from "@angular/common"
import  { AuthenticationRequest } from "../../models/authentication-request.model"
import  { TemporaryCredentialsService } from "../../../services/temporary-credentials.service"

@Component({
  selector: "app-email-code-verification",
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgOtpInputModule],
  templateUrl: "./email-code-verification.component.html",
  styleUrl: "./email-code-verification.component.scss",
})
export class EmailCodeVerificationComponent implements OnInit {
  @ViewChild("ngOtpInput") ngOtpInput: NgOtpInputComponent | undefined
  verificationSuccess = false
  verificationError = false
  errorMessage = ""
  email = ""
  verificationForm: FormGroup
  otp = ""

  constructor(
    public themeService: CustomizerSettingsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tempCredentialsService: TemporaryCredentialsService,
    private route: ActivatedRoute,
  ) {
    this.verificationForm = this.fb.group({
      code: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params["email"]
      console.log("Email", this.email)
      this.sendVerificationCode()
    })
  }

  sendVerificationCode() {
    const request: AuthenticationRequest = {
      email: this.email,
      authMethode: "EMAIL_VERIFICATION",
    }
    this.authService.sendEmailCodeLogin(request).subscribe({
      next: (response) => {
        console.log("Verification code sent", response)
      },
      error: (error) => {
        console.error("Failed to send verification code", error)
      },
    })
  }

  onOtpChange(otp: string) {
    this.otp = otp
  }

  onSubmit(): void {
    if (this.otp.length !== 6) {
      this.errorMessage = "Please enter a 6-digit verification code."
      this.verificationError = true
      return
    }

    const credentials = this.tempCredentialsService.getCredentials()
    if (!credentials) {
      console.error("No credentials found")
      return
    }

    const request: AuthenticationRequest = {
      email: credentials.email,
      password: credentials.password,
      verificationCode: this.otp,
      authMethode: "EMAIL_VERIFICATION",
    }

    console.log("Verification request", request)

    this.tempCredentialsService.clearCredentials()

    this.authService.login(request).subscribe({
      next: (response) => {
        this.verificationSuccess = true
        this.verificationError = false
        this.authService.getUserByEmail(request.email).subscribe({
          next:(resp:any)=>{
            const user = resp.data;
            sessionStorage.setItem("auth-user",JSON.stringify(user));
          },
          error:(error)=>{
            console.log(error)
        }
        })
        setTimeout(() => {
          this.router.navigate(["/dashboard"])
        }, 3000)
      },
      error: (error) => {
        this.verificationError = true
        this.errorMessage = error.error?.message || "Invalid verification code. Please try again."
        // @ts-ignore
        this.ngOtpInput.setValue("")
      },
    })
  }

  resendCode(): void {
    this.sendVerificationCode()
  }
}

