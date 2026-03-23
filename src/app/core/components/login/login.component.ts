import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  loading = false;
  errorMessages: string[] = [];
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private authState: AuthStateService,
    private cdr: ChangeDetectorRef
  ) {
    // Redirect if already logged in
    if (this.authState.isAuthenticated()) {
      this.router.navigate(['/index']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    this.initializeGoogleLogin();
  }

  async initializeGoogleLogin() {
    try {
      await this.googleAuthService.initializeGoogleAuth();
    } catch (error) {
      console.error('Error initializing Google login:', error);
    }
  }

  onGoogleLogin() {
    this.googleAuthService.promptGoogleLogin();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loading = true;
      this.errorMessages = [];

      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.loginService.login(credentials)
        .pipe(finalize(() => {
          this.loading = false;
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (response) => {
            if (response?.statusCode >= 200 && response?.statusCode < 300 && response.data) {
              localStorage.setItem('userEmail', credentials.email);
              this.router.navigate(['/index'], { replaceUrl: true });
            } else if (response?.error?.errors?.length) {
              this.errorMessages = response.error.errors;
            } else {
              this.errorMessages = ['Login failed. Please check your credentials.'];
            }
          },
          error: (error) => {
            this.errorMessages = Array.isArray(error) ? error : ['An unexpected error occurred. Please try again.'];
          }
        });
    } else {
      this.errorMessages = ['Please fill in all required fields correctly'];
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  clearErrors() {
    this.errorMessages = [];
  }
} 