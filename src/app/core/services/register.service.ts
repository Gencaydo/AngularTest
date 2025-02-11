import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { APIResponseModel } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'your-api-url/auth/register';

  constructor(private http: HttpClient) { }

  register(registerData: RegisterModel): Observable<APIResponseModel<any>> {
    return this.http.post<APIResponseModel<any>>(this.apiUrl, registerData);
  }
} 