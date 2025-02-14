import { Component } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import {
  NgToastModule,
  NgToastService,
  ToasterPosition,
} from 'ng-angular-popup';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RecaptchaModule, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Pgap - Angular 18 Bootstrap Admin Dashboard Template';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private toast: NgToastService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top after each navigation end
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  showToast() {
    // Exemple d'utilisation
    this.toast.success('Opération réussie!', 'Succès', 5000);
    this.toast.danger('Opération échouée!', 'Erreur', 5000);
    this.toast.info('Information importante', 'Info', 5000);
    this.toast.warning('Attention!', 'Avertissement', 5000);
  }

  protected readonly ToasterPosition = ToasterPosition;
}
