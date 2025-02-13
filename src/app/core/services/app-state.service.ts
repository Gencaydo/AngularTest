import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

interface AppState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private initialState: AppState = {
    userProfile: null,
    loading: false,
    error: null
  };

  private state = new BehaviorSubject<AppState>(this.initialState);

  setLoading(loading: boolean) {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  setError(error: string | null) {
    this.state.next({
      ...this.state.value,
      error
    });
  }

  setUserProfile(profile: UserProfile | null) {
    this.state.next({
      ...this.state.value,
      userProfile: profile
    });
  }

  getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  getCurrentState(): AppState {
    return this.state.value;
  }
} 