import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserRole } from '../models/asp-net-user-role.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserRolesService {
  private controller = 'User';

  constructor(private api: ApiService) {}

  getUserRoles(userId: string): Observable<AspNetUserRole[]> {
    return this.api.get<AspNetUserRole[]>(this.controller, `GetUserRoles/${userId}`);
  }

  addUserToRole(data: { userId: string; roleId: string }): Observable<void> {
    return this.api.post<void>(this.controller, 'AddUserToRole', data);
  }

  removeUserFromRole(data: { userId: string; roleId: string }): Observable<void> {
    return this.api.delete<void>(this.controller, 'RemoveUserFromRole', data);
  }
}
