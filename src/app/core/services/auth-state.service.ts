import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; 

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    email: string;
    userName: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
  };

  private authState = new BehaviorSubject<AuthState>(this.loadState());

  constructor() {
    // Initialize state from localStorage
    this.loadState();
  }

  private loadState(): AuthState {
    const savedState = localStorage.getItem('authState');
    return savedState ? JSON.parse(savedState) : this.initialState;
  }

  private saveState(state: AuthState) {
    localStorage.setItem('authState', JSON.stringify(state));
    this.authState.next(state);
  }

  login(token: string, user: { email: string; userName: string }) {
    const newState: AuthState = {
      isAuthenticated: true,
      token,
      user
    };
    this.saveState(newState);
  }

  logout() {
    localStorage.removeItem('authState');
    localStorage.removeItem('loginData');
    localStorage.removeItem('userEmail');
    this.authState.next(this.initialState);
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authState.value.token;
  }

  getUser(): { email: string; userName: string } | null {
    return this.authState.value.user;
  }
} 