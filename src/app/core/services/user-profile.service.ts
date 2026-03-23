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
    const user = this.authStateService.getUser();
    if (!user?.email) {
      throw new Error('User email not found');
    }
    const params = { email: user.email };

    return this.apiService.get<ApiResponse<UserProfile>>(this.controller, 'GetUserByEmail', params)
      .pipe(
        tap({
          next: (response) => {
            if (response?.data) {
              this.appState.setUserProfile(response.data);
            }
          },
          error: (error) => {
            this.appState.setError(error);
          }
        })
      );
  }

  updateUserProfile(userData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    const currentProfile = this.appState.getCurrentState().userProfile;

    if (!currentProfile?.id) {
      throw new Error('User profile not found');
    }

    const updateData = {
      ...userData,
      id: currentProfile.id,
      userName: currentProfile.userName
    };

    return this.apiService.put<ApiResponse<UserProfile>>(this.controller, 'UpdateUser', updateData)
      .pipe(
        tap({
          next: (response) => {
            const isSuccess = response?.statusCode >= 200 && response?.statusCode < 300;
            if (response?.data) {
              this.appState.setUserProfile(response.data);
            } else if (isSuccess) {
              this.appState.setUserProfile({ ...currentProfile, ...userData });
            }
          },
          error: (error) => {
            this.appState.setError(error);
          }
        })
      );
  }
} 