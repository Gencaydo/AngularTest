import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { LoginModel } from '../models/login.model';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private controller = 'Auth';

  constructor(
    private apiService: ApiService,
    private authState: AuthStateService
  ) { }

  login(credentials: LoginModel): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'CreateToken', credentials)
      .pipe(
        tap(response => {
          console.log('Login Response:', response); // Debug log
          if (response.statusCode === 200 && response.data) {
            this.authState.login(response.data.token, {
              email: credentials.email,
              userName: response.data.userName || credentials.email
            });
          }
        })
      );
  }

  googleLogin(token: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'google', { token });
  }

  logout(): Observable<any> {
    // If you don't have a logout endpoint, just handle it locally
    return of(null).pipe(
      tap(() => {
        this.authState.logout();
      })
    );

    // If you have a logout endpoint, use this instead:
    /*
    return this.apiService.post<ApiResponse<void>>(this.controller, 'logout')
      .pipe(
        tap(() => {
          this.authState.logout();
        })
      );
    */
  }

  refreshToken(): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'refresh-token');
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.controller, 'forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.controller, 'reset-password', {
      token,
      newPassword
    });
  }
} 