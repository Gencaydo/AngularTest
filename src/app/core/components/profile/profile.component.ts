import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  userProfile?: UserProfile;
  userName: string = '';
  email: string = '';
  profileImage: string = '';

  // Default profile image as a data URL
  readonly defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U5ZWNlZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgNC44NCAyLjE3IDQuODQgNC44NCAwIDIuNjctMi4xNyA4NC00Ljg0IDQuODQtMi42NyAwLTQuODQtMi4xNy00Ljg0LTQuODQgMC0yLjY3IDIuMTctNC44NCA0Ljg0LTQuODR6bTAgMTJhOS45MSA5LjkxIDAgMCAxLTguMDQtNC40MmMxLjU4LTIuMTIgMy42Ni0zLjU4IDYuMDQtMy41OHM0LjQ2IDEuNDYgNi4wNCAzLjU4QTkuOTEgOS45MSAwIDAgMSAxMiAxN3oiLz48L3N2Zz4=';

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      id: [''],
      userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      mobilePhoneNumber: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.errorMessage = '';
    this.userProfileService.getUserProfile().subscribe({
      next: (response: ApiResponse<UserProfile>) => {
        if (response && response.data) {
          const userData = response.data;
          this.profileForm.patchValue({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            mobilePhoneNumber: userData.mobilePhoneNumber || ''
          });
          this.userName = userData.userName || '';
          this.email = userData.email || '';
          this.profileImage = userData.profileImage || this.defaultProfileImage;
        }
      },
      error: (error: Error) => {
        console.error('Error loading profile:', error);
        this.showMessage('Error loading profile', 'error');
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
      console.log('Form Data Before Update:', formData);
      console.log('First Name Before Update:', formData.firstName);
      console.log('Mobile Phone Before Update:', formData.mobilePhoneNumber);
      
      // Ensure we're not sending empty values for required fields
      if (!formData.userName || !formData.email) {
        this.errorMessage = 'Username and email are required';
        this.loading = false;
        return;
      }

      // Create a complete user profile object
      const updateData: UserProfile = {
        id: formData.id,
        userName: formData.userName,
        email: formData.email,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        mobilePhoneNumber: formData.mobilePhoneNumber || ''
      };

      console.log('Data Being Sent to API:', updateData);

      this.userProfileService.updateUserProfile(updateData).subscribe({
        next: (response) => {
          console.log('Update Response:', response);
          if (response.data) {
            this.successMessage = 'Profile updated successfully';
            this.userProfile = response.data;
            this.userName = response.data.userName || '';
            this.email = response.data.email || '';
            console.log('Updated User Profile:', this.userProfile);
            // Update form with the response data
            const updatedFormData = {
              id: response.data.id || '',
              userName: response.data.userName || '',
              email: response.data.email || '',
              firstName: response.data.firstName || '',
              lastName: response.data.lastName || '',
              mobilePhoneNumber: response.data.mobilePhoneNumber || ''
            };
            console.log('Updated Form Data:', updatedFormData);
            this.profileForm.setValue(updatedFormData);
            console.log('Form Values After Update:', this.profileForm.value);
          }
        },
        error: (error) => {
          console.error('Update Error:', error);
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

  onCancel() {
    this.router.navigate(['/index']);
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
} 