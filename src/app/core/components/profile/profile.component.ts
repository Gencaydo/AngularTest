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
  userName: string = '';
  email: string = '';
  profileImage: string = '';
  errorMessage: string = '';
  messageType: 'success' | 'error' = 'error';
  loading: boolean = false;
  lastUpdated: string = 'Today';
  showSuccessOverlay: boolean = false;

  // Default profile image as a data URL
  readonly defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U5ZWNlZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgNC44NCAyLjE3IDQuODQgNC44NCAwIDIuNjctMi4xNyA0Ljg0LTQuODQgNC44NC0yLjY3IDAtNC44NC0yLjE3LTQuODQtNC44NCAwLTIuNjcgMi4xNy00Ljg0IDQuODQtNC44NHptMCAxMmE5LjkxIDkuOTEgMCAwIDEtOC4wNC00LjQyYzEuNTgtMi4xMiAzLjY2LTMuNTggNi4wNC0zLjU4czQuNDYgMS40NiA2LjA0IDMuNThBOS45MSA5LjkxIDAgMCAxIDEyIDE3eiIvPjwvc3ZnPg==';

  constructor(
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{value: '', disabled: true}],
      mobilePhoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]]
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
        console.log('Profile response:', response);
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
          this.lastUpdated = this.formatDate(new Date());
        }
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading profile:', error);
        this.showMessage('Error loading profile', 'error');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Get the form values including disabled fields
      const formData = this.profileForm.getRawValue();
      
      // Create the update payload
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email, // Include the email from the disabled field
        mobilePhoneNumber: formData.mobilePhoneNumber
      };

      console.log('Updating profile with data:', updateData);

      this.userProfileService.updateUserProfile(updateData).subscribe({
        next: (response) => {
          console.log('Profile update success:', response);
          // Don't show message in the message container for success
          this.loading = false;
          // Update the last updated date
          this.lastUpdated = this.formatDate(new Date());
          
          // Show the success overlay
          this.showSuccessOverlay = true;
          setTimeout(() => {
            this.showSuccessOverlay = false;
          }, 2000); // Reduced to 2 seconds for the smaller box
          
          // Reload user profile to get the latest data
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showMessage('Error updating profile: ' + (error.message || 'Unknown error'), 'error');
          this.loading = false;
        }
      });
    } else {
      // Clear any previous success messages
      this.errorMessage = '';
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      this.showMessage('Please fix the validation errors before submitting', 'error');
    }
  }

  onCancel() {
    this.router.navigate(['/index']);
  }

  showMessage(message: string, type: 'success' | 'error') {
    console.log(`Showing ${type} message:`, message);
    this.errorMessage = message;
    this.messageType = type;
    
    // Force the message to be visible for at least 5 seconds
    setTimeout(() => {
      console.log('Message timeout reached');
      this.errorMessage = '';
    }, 5000);
    
    // For debugging - log the state after 1 second
    setTimeout(() => {
      console.log('Message state after 1 second:', {
        message: this.errorMessage,
        type: this.messageType,
        isVisible: !!this.errorMessage
      });
    }, 1000);
  }

  // Helper method to format dates
  private formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
} 