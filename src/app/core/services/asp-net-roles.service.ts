import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetRole } from '../models/asp-net-role.model';

@Injectable({ providedIn: 'root' })
export class AspNetRolesService {
  private controller = 'Role';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetRole[]> {
    return this.api.get<AspNetRole[]>(this.controller, 'GetAll');
  }

  getById(id: string): Observable<AspNetRole> {
    return this.api.get<AspNetRole>(this.controller, `GetById/${id}`);
  }

  create(role: Partial<AspNetRole>): Observable<AspNetRole> {
    return this.api.post<AspNetRole>(this.controller, 'Create', role);
  }

  update(id: string, role: Partial<AspNetRole>): Observable<AspNetRole> {
    return this.api.put<AspNetRole>(this.controller, 'Update', { ...role, id });
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(this.controller, `Delete/${id}`);
  }
}
