import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUser } from '../models/asp-net-user.model';

@Injectable({ providedIn: 'root' })
export class AspNetUsersService {
  private controller = 'AspNetUsers';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUser[]> {
    return this.api.get<AspNetUser[]>(this.controller);
  }

  getById(id: string): Observable<AspNetUser> {
    return this.api.get<AspNetUser>(this.controller, id);
  }

  create(user: Partial<AspNetUser>): Observable<AspNetUser> {
    return this.api.post<AspNetUser>(this.controller, undefined, user);
  }

  update(id: string, user: Partial<AspNetUser>): Observable<AspNetUser> {
    return this.api.put<AspNetUser>(this.controller, id, user);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(this.controller, id);
  }
}
