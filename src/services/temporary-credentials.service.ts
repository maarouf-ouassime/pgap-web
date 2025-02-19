// temporary-credentials.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemporaryCredentialsService {
  private credentials: { email: string; password?: string; secret?: string } | null = null;

  storeCredentials(email: string, password?: string, secret?: string): void {
    this.credentials = { email, password, secret };
    console.log('Credentials stored', this.credentials);
  }

  getCredentials(): { email: string; password?: string; secret?: string } | null {
    console.log('Credentials retrieved', this.credentials);
    return this.credentials;
  }

  clearCredentials(): void {
    this.credentials = null;
    console.log('Credentials cleared');
  }
}
