import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const token = this.authState.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private createUrl(controller: string, action?: string): string {
    let url = `${this.baseUrl}/${controller}`;
    if (action) {
      url += `/${action}`;
    }
    return url;
  }

  get<T>(controller: string, action?: string, params: any = {}): Observable<T> {
    return this.http
      .get<T>(this.createUrl(controller, action), {
        headers: this.getHeaders(),
        params
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .post<T>(this.createUrl(controller, action), body, {
        headers: this.getHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  put<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .put<T>(this.createUrl(controller, action), body, {
        headers: this.getHeaders()
      })
      .pipe(catchError(this.handleError));
  }

  delete<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .delete<T>(this.createUrl(controller, action), {
        headers: this.getHeaders(),
        body
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorResponse = error.error;

    if (errorResponse?.error?.errors?.length) {
      return throwError(() => errorResponse.error.errors as string[]);
    }

    if (errorResponse?.errors?.length) {
      return throwError(() => errorResponse.errors as string[]);
    }

    if (error.status === 0) {
      return throwError(() => ['Unable to reach the server. Please check your connection.']);
    }

    return throwError(() => [error.message || 'An unexpected error occurred']);
  }
}
