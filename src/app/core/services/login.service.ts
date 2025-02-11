import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { APIResponseModel } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'your-api-url/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    // This is a mock implementation. Replace with actual API call
    return of({ 
      success: true, 
      message: 'Login successful' 
    });
  }
} 