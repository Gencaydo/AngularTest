import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserLogin } from '../models/asp-net-user-login.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserLoginsService {
  private controller = 'AspNetUserLogins';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUserLogin[]> {
    return this.api.get<AspNetUserLogin[]>(this.controller);
  }

  getByKey(loginProvider: string, providerKey: string): Observable<AspNetUserLogin> {
    return this.api.get<AspNetUserLogin>(this.controller, `${loginProvider}/${providerKey}`);
  }

  create(login: Partial<AspNetUserLogin>): Observable<AspNetUserLogin> {
    return this.api.post<AspNetUserLogin>(this.controller, undefined, login);
  }

  update(loginProvider: string, providerKey: string, login: Partial<AspNetUserLogin>): Observable<AspNetUserLogin> {
    return this.api.put<AspNetUserLogin>(this.controller, `${loginProvider}/${providerKey}`, login);
  }

  delete(loginProvider: string, providerKey: string): Observable<void> {
    return this.api.delete<void>(this.controller, `${loginProvider}/${providerKey}`);
  }
}
