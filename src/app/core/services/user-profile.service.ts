import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { UserProfile } from '../models/user-profile.model';
import { AppStateService } from './app-state.service';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private controller = 'User';

  constructor(
    private apiService: ApiService,
    private appState: AppStateService,
    private authStateService: AuthStateService
  ) { }

  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    this.appState.setLoading(true);
    const user = this.authStateService.getUser();
    if (!user?.email) {
      this.appState.setLoading(false);
      throw new Error('User email not found');
    }
    const params = { email: user.email };
    
    return this.apiService.post<ApiResponse<UserProfile>>(this.controller, 'GetUserByEmail', params)
      .pipe(
        tap({
          next: (response) => {
            if (response.data) {
              this.appState.setUserProfile(response.data);
            }
            this.appState.setLoading(false);
          },
          error: (error) => {
            this.appState.setError(error);
            this.appState.setLoading(false);
          }
        })
      );
  }

  updateUserProfile(userData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    this.appState.setLoading(true);
    // Get the current user profile from app state
    const currentProfile = this.appState.getCurrentState().userProfile;
    
    if (!currentProfile?.id) {
      this.appState.setLoading(false);
      console.error('User profile ID not found in app state', currentProfile);
      throw new Error('User profile not found');
    }

    // Add the user ID to the update data
    const updateData = {
      ...userData,
      id: currentProfile.id,
      userName: currentProfile.userName // Ensure userName is included
    };

    console.log('Sending update data to API:', updateData);

    return this.apiService.put<ApiResponse<UserProfile>>(this.controller, 'UpdateUser', updateData)
      .pipe(
        tap({
          next: (response) => {
            console.log('API response from update:', response);
            if (response.data) {
              // Update the profile in the app state
              this.appState.setUserProfile(response.data);
            } else if (response.statusCode >= 200 && response.statusCode < 300) {
              // If successful status code but no data returned, update with what we sent
              this.appState.setUserProfile({...currentProfile, ...userData});
            }
            this.appState.setLoading(false);
          },
          error: (error) => {
            console.error('Profile update error:', error);
            this.appState.setError(error);
            this.appState.setLoading(false);
          }
        })
      );
  }
} 