import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private controller = 'User';

  constructor(private apiService: ApiService) { }

  register(userData: RegisterModel): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'CreateUser', userData);
  }

  verifyEmail(token: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(this.controller, 'verify-email', { token });
  }

  resendVerification(email: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.controller, 'resend-verification', { email });
  }
} 