import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private controller = 'Auth';

  constructor(private apiService: ApiService) { }

  login(credentials: LoginModel): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'CreateToken', credentials);
  }

  googleLogin(token: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'google', { token });
  }

  logout(): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.controller, 'logout');
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