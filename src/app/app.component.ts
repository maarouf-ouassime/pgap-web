import { Component } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {NgToastModule, ToasterPosition} from "ng-angular-popup";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Platform for managing calls for projects';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top after each navigation end
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  getOuassime() {
    this.authService.getMessageOuassime().subscribe({
      next: (response) => {
        console.log('Response from Ouassime', response);
      },
      error: (error) => {
        console.error('Failed to get response from Ouassime', error);
      }
    });
  }

  protected readonly ToasterPosition = ToasterPosition;
}
