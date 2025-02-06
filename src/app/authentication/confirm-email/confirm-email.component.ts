import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";
import {AuthenticationRequest} from "../../models/authentication-request.model";
import {VerificationRequest} from "../../models/verification-request.model";

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {

  // isToggled
  isToggled = false;

  isVerified = false;
  errorMessage = '';

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const email = params['email']; // Si nécessaire selon votre implémentation

      let request: VerificationRequest = {
        email: email,
        code: code
      };

      console.log("code : ", code);
      console.log("email : ", email);

      if (code) {
        this.authService.verifyEmail(request).subscribe({
          next: (data) => {
            console.log("data : ", data);
            this.isVerified = true;
          },
          error: (err) => {
            console.error("err : ", err);
            this.errorMessage = err.error?.message || "Une erreur est survenue.";
          }
        });
      }
    });
  }


}
