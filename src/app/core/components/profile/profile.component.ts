import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  userProfile?: UserProfile;

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.errorMessage = '';
    this.userProfileService.getUserProfile().subscribe({
      next: (response) => {
        if (response.data) {
          this.userProfile = response.data;
          // Ensure we're not setting empty values
          const formData = {
            userName: response.data.userName || '',
            email: response.data.email || '',
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            phoneNumber: response.data.phoneNumber || ''
          };
          this.profileForm.patchValue(formData);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load user profile';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.profileForm.value;
      // Ensure we're not sending empty values
      if (!formData.userName || !formData.email) {
        this.errorMessage = 'Username and email are required';
        this.loading = false;
        return;
      }

      this.userProfileService.updateUserProfile(formData).subscribe({
        next: (response) => {
          if (response.data) {
            this.successMessage = 'Profile updated successfully';
            this.userProfile = response.data;
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update profile';
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  clearError() {
    this.errorMessage = '';
  }

  goBack() {
    this.router.navigate(['/index']);
  }
} 