import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  loading = false;
  errorMessages: string[] = [];
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router
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
      validator: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const passwordConfirm = g.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.loading = true;
      this.errorMessages = [];

      const { passwordConfirm, ...registerData } = this.registerForm.value;
      this.registerService.register(registerData).subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            localStorage.setItem('registrationData', JSON.stringify({
              message: 'Registration successful! Please verify your email.',
              email: this.registerForm.get('email')?.value
            }));
            this.router.navigate(['/login'], { replaceUrl: true });
          } else if (response.error?.errors?.length) {
            this.errorMessages = response.error.errors;
          }
        },
        error: (error) => {
          this.errorMessages = Array.isArray(error) ? error : ['An unexpected error occurred. Please try again.'];
          this.loading = false;
          this.isSubmitting = false;
        },
        complete: () => {
          this.loading = false;
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessages = ['Please fill in all required fields correctly'];
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
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