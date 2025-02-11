import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;

  constructor(private http: HttpClient) {
    // Load Google's OAuth2 library
    this.loadGoogleLibrary();
  }

  private loadGoogleLibrary() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  initializeGoogleAuth(): Promise<void> {
    return new Promise<void>((resolve) => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      resolve();
    });
  }

  private handleCredentialResponse(response: any) {
    // Send the token to your backend
    console.log("Google token:", response.credential);
    this.authenticateWithBackend(response.credential).subscribe(
      (response) => {
        if (response.success) {
          // Store email from response if needed
          localStorage.setItem('email', response.data.email);
          console.log('Authentication successful:', response);
        }
      },
      (error) => {
        console.error('Authentication failed:', error);
      }
    );
  }

  private authenticateWithBackend(token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/google`, { token });
  }

  promptGoogleLogin() {
    google.accounts.id.prompt();
  }
} 