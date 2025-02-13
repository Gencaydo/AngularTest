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
      userName: ['', Validators.required],
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
    this.userProfileService.getUserProfile().subscribe({
      next: (response) => {
        if (response.data) {
          this.userProfile = response.data;
          this.profileForm.patchValue(response.data);
        }
      },
      error: (error) => {
        this.errorMessage = error;
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

      this.userProfileService.updateUserProfile(this.profileForm.value).subscribe({
        next: (response) => {
          if (response.data) {
            this.successMessage = 'Profile updated successfully';
            this.userProfile = response.data;
          }
        },
        error: (error) => {
          this.errorMessage = error;
        },
        complete: () => {
          this.loading = false;
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