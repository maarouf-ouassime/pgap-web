import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common'; // Import CommonModule
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  public environment = environment;
  // isToggled
  isToggled = false;

  // Add properties for email confirmation status
  confirmationMessage: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = true;

  constructor(
    public themeService: CustomizerSettingsService,
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to access query parameters
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
    // Extract the token from the URL query parameters
    this.route.queryParams.subscribe((params) => {
      const token = params['token']; // Get the token from the URL
      if (token) {
        this.confirmEmail(token); // Call the confirmEmail method
        localStorage.setItem('resetPasswordToken', token);
        // Redirigez l'utilisateur vers reset-password avec le token
      } else {
        this.isLoading = false;
        this.confirmationMessage =
          'Token is missing. Please check your email for the correct link.';
        this.isSuccess = false;
      }
    });
  }

  // Method to confirm the email
  confirmEmail(token: string): void {
    this.authService.confirmEmail(token).subscribe(
      (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.confirmationMessage =
          response.message || 'Email confirmed successfully!';
      },
      (error) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.confirmationMessage =
          error.error?.message ||
          'An error occurred while confirming your email. Please try again.';
      }
    );
  }
}
