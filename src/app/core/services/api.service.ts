import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      .pipe(catchError((err) => this.handleError(err)));
  }

  post<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .post<T>(this.createUrl(controller, action), body, {
        headers: this.getHeaders()
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  put<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .put<T>(this.createUrl(controller, action), body, {
        headers: this.getHeaders()
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  delete<T>(controller: string, action?: string, body: any = {}): Observable<T> {
    return this.http
      .delete<T>(this.createUrl(controller, action), {
        headers: this.getHeaders(),
        body
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const body = error.error;
    const parsedMessages = this.extractMessagesFromBody(body);

    if (parsedMessages.length) {
      return throwError(() => parsedMessages);
    }

    if (error.status === 0) {
      return throwError(() => ['Unable to reach the server. Please check your connection.']);
    }

    return throwError(() => [error.message || 'An unexpected error occurred']);
  }

  private extractMessagesFromBody(body: unknown): string[] {
    if (!body) {
      return [];
    }

    if (typeof body === 'string' && body.trim()) {
      return [body];
    }

    if (typeof body !== 'object') {
      return [];
    }

    const typedBody = body as {
      error?: unknown;
      errors?: unknown;
      errorMessages?: unknown;
      message?: unknown;
      title?: unknown;
      detail?: unknown;
    };

    // API returns { error: { errors: string[] } }
    if (typedBody.error && typeof typedBody.error === 'object') {
      const nestedError = typedBody.error as { errors?: unknown; errorMessages?: unknown; message?: unknown };

      if (Array.isArray(nestedError.errors) && nestedError.errors.length) {
        return nestedError.errors.map((msg) => String(msg));
      }

      if (Array.isArray(nestedError.errorMessages) && nestedError.errorMessages.length) {
        return nestedError.errorMessages.map((msg) => String(msg));
      }

      if (typeof nestedError.message === 'string' && nestedError.message.trim()) {
        return [nestedError.message];
      }
    }

    // API returns { errors: string[] }
    if (Array.isArray(typedBody.errors) && typedBody.errors.length) {
      return typedBody.errors.map((msg) => String(msg));
    }

    // API returns { errorMessages: string[] }
    if (Array.isArray(typedBody.errorMessages) && typedBody.errorMessages.length) {
      return typedBody.errorMessages.map((msg) => String(msg));
    }

    // ASP.NET validation style: { errors: { field: ["msg1", "msg2"] } }
    if (typedBody.errors && typeof typedBody.errors === 'object') {
      const validationErrors = typedBody.errors as Record<string, unknown>;
      const messages = Object.values(validationErrors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

      if (messages.length) {
        return messages;
      }
    }

    if (typeof typedBody.error === 'string' && typedBody.error.trim()) {
      return [typedBody.error];
    }

    if (typeof typedBody.message === 'string' && typedBody.message.trim()) {
      return [typedBody.message];
    }

    if (typeof typedBody.detail === 'string' && typedBody.detail.trim()) {
      return [typedBody.detail];
    }

    if (typeof typedBody.title === 'string' && typedBody.title.trim()) {
      return [typedBody.title];
    }

    return [];
  }
}
