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
    return this.apiService.put<ApiResponse<UserProfile>>(this.controller, 'UpdateUser', userData)
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
} 