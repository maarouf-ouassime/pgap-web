import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import * as QRCode from "qrcode";
import { NgIf } from "@angular/common";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TemporaryCredentialsService} from "../../../services/temporary-credentials.service";
import {AuthenticationRequest} from "../../models/authentication-request.model";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-scan-code-app',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './scan-code-app.component.html',
  styleUrls: ['./scan-code-app.component.scss'] // Correction également ici (styleUrl -> styleUrls)
})
export class ScanCodeAppComponent implements OnInit {
  qrCodeDataUrl: string = "";
  authForm: FormGroup;
  isLoading = false;
  email: string = ''; // Add email property


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private tempCredentialsService: TemporaryCredentialsService,
              private toaster: NgToastService,
              private route: ActivatedRoute) {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    this.authForm = this.fb.group({
      verificationCode: ["", [Validators.required, Validators.pattern("^[0-9]{6}$")]],
    });
  }

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    this.authService.getQrCodeAppAuthentification(this.email).subscribe({
      next: (response) => {
        console.log('QR code response', response);
        if (response.data) {
          this.qrCodeDataUrl = response.data;
          this.toaster.success(response.message, 'Succès', 5000);
        }

      },
      error: (error) => {
        console.error('Failed to get QR code', error);
        this.toaster.danger(error.error?.message || 'Failed to get QR code' ,'Erreur', 5000);
      },
    });

    const qrData = this.qrCodeDataUrl;
    if (qrData && qrData.length > 0) {
      QRCode.toDataURL(qrData, { width: 200, margin: 2 }, (err, url) => {
        if (err) {
          console.error("Erreur lors de la génération du QR code", err);
          return;
        }
        this.qrCodeDataUrl = url;
      });
    }
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
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
      verificationCode: this.authForm.value.verificationCode,
      authMethode: '2FA_QR_CODE'
    };
    console.log('Verification request', request);

    this.tempCredentialsService.clearCredentials();
    // Appel du service pour vérifier le code
    this.authService.login(request).subscribe({
      next: (response) => {
       console.log('Verification response', response);
        this.toaster.success(response.message, 'Connexion réussie');
        // Redirection après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to verify code', error);
        this.toaster.danger(error.error?.message, 'Erreur de connexion');
      }
    });
  }
}
