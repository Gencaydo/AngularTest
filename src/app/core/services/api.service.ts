import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any default headers here
      // 'Authorization': `Bearer ${this.getToken()}`
    });
  }

  private createUrl(controller: string, action?: string): string {
    let url = `${this.baseUrl}/${controller}`;
    if (action) {
      url += `/${action}`;
    }
    return url;
  }

  get<T>(controller: string, action?: string, params: any = {}): Observable<T> {
    const headers = this.createHeaders();
    let httpParams = new HttpParams();
    
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get<T>(this.createUrl(controller, action), { headers, params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    const headers = this.createHeaders();
    return this.http.post<T>(this.createUrl(controller, action), body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    const headers = this.createHeaders();
    return this.http.put<T>(this.createUrl(controller, action), body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    const headers = this.createHeaders();
    return this.http.delete<T>(this.createUrl(controller, action), { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
} 