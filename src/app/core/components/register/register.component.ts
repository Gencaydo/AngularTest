import { ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription, TimeoutError, finalize, take, timeout } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const passwordConfirm = group.get('passwordConfirm')?.value;
  return password === passwordConfirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  loading = false;
  errorMessages: string[] = [];
  hidePassword = true;
  hideConfirmPassword = true;

  private valueChangesSub: Subscription;
  private registerSub?: Subscription;
  private loadingGuardTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobilePhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)]]
    }, {
      validators: passwordMatchValidator
    });

    this.valueChangesSub = this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessages.length) {
        this.errorMessages = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.valueChangesSub.unsubscribe();
    this.registerSub?.unsubscribe();
    this.stopLoading();
  }

  onSubmit(): void {
    if (this.loading) {
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessages = [];
    this.startLoadingGuard();

    const { passwordConfirm, ...registerData } = this.registerForm.value;
    this.registerSub?.unsubscribe();
    this.registerSub = this.registerService.register(registerData).pipe(
      take(1),
      timeout(15000),
      finalize(() => {
        this.runInUi(() => this.stopLoading());
      })
    ).subscribe({
      next: (response) => {
        this.runInUi(() => {
          if (this.isSuccessfulStatus(response?.statusCode)) {
            localStorage.setItem('registrationData', JSON.stringify({
              message: 'Registration successful! Please verify your email.',
              email: this.registerForm.get('email')?.value
            }));
            this.router.navigate(['/login'], { replaceUrl: true });
          } else {
            const responseMessages = this.extractResponseMessages(response);
            this.errorMessages = responseMessages.length
              ? responseMessages
              : ['Registration failed. Please check your details and try again.'];
          }

          this.stopLoading();
        });
      },
      error: (error) => {
        this.runInUi(() => {
          this.errorMessages = this.extractErrorMessages(error);
          this.stopLoading();
        });
      }
    });
  }

  clearErrors(): void {
    this.errorMessages = [];
  }

  private startLoadingGuard(): void {
    this.clearLoadingGuard();
    this.loadingGuardTimer = setTimeout(() => {
      this.runInUi(() => {
        if (!this.loading) {
          return;
        }

        this.loading = false;
        if (!this.errorMessages.length) {
          this.errorMessages = ['Request is taking too long. Please try again.'];
        }
      });
    }, 20000);
  }

  private clearLoadingGuard(): void {
    if (this.loadingGuardTimer !== null) {
      clearTimeout(this.loadingGuardTimer);
      this.loadingGuardTimer = null;
    }
  }

  private stopLoading(): void {
    this.loading = false;
    this.clearLoadingGuard();
    if (!this.destroyed) {
      this.cdr.detectChanges();
    }
  }

  private runInUi(action: () => void): void {
    this.ngZone.run(() => {
      action();
      if (!this.destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  private isSuccessfulStatus(statusCode: unknown): boolean {
    return typeof statusCode === 'number' && statusCode >= 200 && statusCode < 300;
  }

  private extractResponseMessages(response: unknown): string[] {
    if (!response || typeof response !== 'object') {
      return [];
    }

    const typedResponse = response as {
      error?: unknown;
      errors?: unknown;
      errorMessages?: unknown;
      message?: unknown;
    };

    if (typedResponse.error && typeof typedResponse.error === 'object') {
      const nestedError = typedResponse.error as {
        errors?: unknown;
        errorMessages?: unknown;
        message?: unknown;
      };

      if (Array.isArray(nestedError.errors) && nestedError.errors.length) {
        return nestedError.errors.map((msg) => String(msg));
      }

      if (Array.isArray(nestedError.errorMessages) && nestedError.errorMessages.length) {
        return nestedError.errorMessages.map((msg) => String(msg));
      }

      if (typeof nestedError.message === 'string' && nestedError.message.trim()) {
        return [nestedError.message];
      }
    }

    if (Array.isArray(typedResponse.errors) && typedResponse.errors.length) {
      return typedResponse.errors.map((msg) => String(msg));
    }

    if (Array.isArray(typedResponse.errorMessages) && typedResponse.errorMessages.length) {
      return typedResponse.errorMessages.map((msg) => String(msg));
    }

    if (typeof typedResponse.message === 'string' && typedResponse.message.trim()) {
      return [typedResponse.message];
    }

    return [];
  }

  private extractErrorMessages(error: unknown): string[] {
    if (error instanceof TimeoutError) {
      return ['Request timed out. Please try again.'];
    }

    if (Array.isArray(error)) {
      return error.map((msg) => String(msg));
    }

    if (typeof error === 'string' && error.trim()) {
      return [error];
    }

    const typedError = error as { error?: unknown; message?: unknown } | null;
    const nestedError = typedError?.error;

    if (nestedError && typeof nestedError === 'object') {
      const nested = nestedError as { errors?: unknown; message?: unknown };

      if (Array.isArray(nested.errors) && nested.errors.length) {
        return nested.errors.map((msg) => String(msg));
      }

      if (typeof nested.message === 'string' && nested.message.trim()) {
        return [nested.message];
      }
    }

    if (typeof nestedError === 'string' && nestedError.trim()) {
      return [nestedError];
    }

    if (typeof typedError?.message === 'string' && typedError.message.trim()) {
      return [typedError.message];
    }

    return ['An unexpected error occurred. Please try again.'];
  }
}
