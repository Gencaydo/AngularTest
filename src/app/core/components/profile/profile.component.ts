import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { finalize } from 'rxjs';

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
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.userProfileService.getUserProfile()
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (response: ApiResponse<UserProfile>) => {
          if (response?.data) {
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
        },
        error: () => {
          this.showMessage('Error loading profile. Please try again.', 'error');
        }
      });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.profileForm.getRawValue();
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobilePhoneNumber: formData.mobilePhoneNumber
      };

      this.userProfileService.updateUserProfile(updateData)
        .pipe(finalize(() => { this.cdr.detectChanges(); }))
        .subscribe({
          next: () => {
            this.lastUpdated = this.formatDate(new Date());
            this.showSuccessOverlay = true;
            setTimeout(() => {
              this.showSuccessOverlay = false;
              this.cdr.detectChanges();
            }, 2000);
            // loadUserProfile manages this.loading itself
            this.loadUserProfile();
          },
          error: (error: unknown) => {
            const msg = Array.isArray(error) ? error.join(', ')
              : (error instanceof Error ? error.message : 'Unknown error');
            this.showMessage('Error updating profile: ' + msg, 'error');
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
    } else {
      this.errorMessage = '';
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      this.showMessage('Please fix the validation errors before submitting', 'error');
    }
  }

  onCancel() {
    this.router.navigate(['/index']);
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.errorMessage = message;
    this.messageType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 5000);
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