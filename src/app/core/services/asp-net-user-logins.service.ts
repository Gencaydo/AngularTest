import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserLogin } from '../models/asp-net-user-login.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserLoginsService {
  private controller = 'User';

  constructor(private api: ApiService) {}

  getUserLogins(userId: string): Observable<AspNetUserLogin[]> {
    return this.api.get<AspNetUserLogin[]>(this.controller, `GetUserLogins/${userId}`);
  }

  removeUserLogin(userId: string, provider: string, key: string): Observable<void> {
    return this.api.delete<void>(this.controller, `RemoveUserLogin/${userId}/${provider}/${key}`);
  }
}
