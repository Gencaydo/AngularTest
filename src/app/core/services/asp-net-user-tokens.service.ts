import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserToken } from '../models/asp-net-user-token.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserTokensService {
  private controller = 'AspNetUserTokens';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUserToken[]> {
    return this.api.get<AspNetUserToken[]>(this.controller);
  }

  getByKey(userId: string, loginProvider: string, name: string): Observable<AspNetUserToken> {
    return this.api.get<AspNetUserToken>(this.controller, `${userId}/${loginProvider}/${name}`);
  }

  create(token: Partial<AspNetUserToken>): Observable<AspNetUserToken> {
    return this.api.post<AspNetUserToken>(this.controller, undefined, token);
  }

  update(userId: string, loginProvider: string, name: string, token: Partial<AspNetUserToken>): Observable<AspNetUserToken> {
    return this.api.put<AspNetUserToken>(this.controller, `${userId}/${loginProvider}/${name}`, token);
  }

  delete(userId: string, loginProvider: string, name: string): Observable<void> {
    return this.api.delete<void>(this.controller, `${userId}/${loginProvider}/${name}`);
  }
}
