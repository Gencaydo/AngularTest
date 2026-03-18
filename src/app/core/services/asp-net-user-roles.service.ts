import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserRole } from '../models/asp-net-user-role.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserRolesService {
  private controller = 'AspNetUserRoles';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUserRole[]> {
    return this.api.get<AspNetUserRole[]>(this.controller);
  }

  getByKey(userId: string, roleId: string): Observable<AspNetUserRole> {
    return this.api.get<AspNetUserRole>(this.controller, `${userId}/${roleId}`);
  }

  create(userRole: Partial<AspNetUserRole>): Observable<AspNetUserRole> {
    return this.api.post<AspNetUserRole>(this.controller, undefined, userRole);
  }

  delete(userId: string, roleId: string): Observable<void> {
    return this.api.delete<void>(this.controller, `${userId}/${roleId}`);
  }
}
