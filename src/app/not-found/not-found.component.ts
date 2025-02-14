import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  // isToggled
  isToggled = false;
  goBack(): void {
    this.location.back(); // Goes back to the previous page
  }
  constructor(
    public themeService: CustomizerSettingsService,
    private location: Location
  ) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }
}
