import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUser } from '../models/asp-net-user.model';

@Injectable({ providedIn: 'root' })
export class AspNetUsersService {
  private controller = 'User';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUser[]> {
    return this.api.get<AspNetUser[]>(this.controller, 'GetAllUsers');
  }

  create(user: Partial<AspNetUser>): Observable<AspNetUser> {
    return this.api.post<AspNetUser>(this.controller, 'CreateUser', user);
  }

  update(user: Partial<AspNetUser>): Observable<AspNetUser> {
    return this.api.put<AspNetUser>(this.controller, 'UpdateUser', user);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(this.controller, `DeleteUser/${id}`);
  }
}
