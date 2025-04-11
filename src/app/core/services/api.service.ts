import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private axiosInstance: AxiosInstance;

  constructor(private authState: AuthStateService) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'
      },
      withCredentials: false
    });

    // Add request interceptor for auth token and logging
    this.axiosInstance.interceptors.request.use(config => {
      const token = this.authState.getToken();
      if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        // Set Authorization header
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    }, error => {
      // Handle request errors
      console.error('Request Configuration Error:', error);
      return Promise.reject(error);
    });

    // Add response interceptor for debugging
    this.axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        console.error('API Error Response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        return Promise.reject(error);
      }
    );
  }

  private createUrl(controller: string, action?: string): string {
    let url = `/${controller}`;
    if (action) {
      url += `/${action}`;
    }
    return url;
  }

  get<T>(controller: string, action?: string, params: any = {}): Observable<T> {
    return from(
      this.axiosInstance.get<T>(this.createUrl(controller, action), { params })
    ).pipe(
      catchError(this.handleError)
    ).pipe(
      // Extract the data from the axios response
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  post<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return from(
      this.axiosInstance.post<T>(this.createUrl(controller, action), body)
    ).pipe(
      catchError(this.handleError)
    ).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  put<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return from(
      this.axiosInstance.put<T>(this.createUrl(controller, action), body)
    ).pipe(
      catchError(this.handleError)
    ).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  delete<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return from(
      this.axiosInstance.delete<T>(this.createUrl(controller, action), { data: body })
    ).pipe(
      catchError(this.handleError)
    ).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  private handleError(error: any) {
    if (error.isAxiosError) {
      // Log the full error details
      console.error('API Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
        status: error.response?.status,
        data: error.response?.data
      });

      const errorResponse = error.response?.data;
      let errorMessage = 'An unexpected error occurred';
      
      if (errorResponse?.error?.errors && errorResponse.error.errors.length > 0) {
        errorMessage = errorResponse.error.errors[0];
      } else if (error.response?.status === 404) {
        errorMessage = `API endpoint not found: ${error.config?.url}`;
      }

      return throwError(() => errorMessage);
    }
    
    return throwError(() => error.message || 'An unexpected error occurred');
  }
} 