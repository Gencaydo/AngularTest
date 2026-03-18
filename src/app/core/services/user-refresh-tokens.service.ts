import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserRefreshToken } from '../models/user-refresh-token.model';

@Injectable({ providedIn: 'root' })
export class UserRefreshTokensService {
  private controller = 'UserRefreshTokens';

  constructor(private api: ApiService) {}

  getAll(): Observable<UserRefreshToken[]> {
    return this.api.get<UserRefreshToken[]>(this.controller);
  }

  getById(id: number): Observable<UserRefreshToken> {
    return this.api.get<UserRefreshToken>(this.controller, String(id));
  }

  create(token: Partial<UserRefreshToken>): Observable<UserRefreshToken> {
    return this.api.post<UserRefreshToken>(this.controller, undefined, token);
  }

  update(id: number, token: Partial<UserRefreshToken>): Observable<UserRefreshToken> {
    return this.api.put<UserRefreshToken>(this.controller, String(id), token);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(this.controller, String(id));
  }

  revoke(id: number): Observable<void> {
    return this.api.put<void>(this.controller, `${id}/revoke`);
  }
}
