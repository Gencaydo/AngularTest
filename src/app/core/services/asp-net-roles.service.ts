import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetRole } from '../models/asp-net-role.model';

@Injectable({ providedIn: 'root' })
export class AspNetRolesService {
  private controller = 'AspNetRoles';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetRole[]> {
    return this.api.get<AspNetRole[]>(this.controller);
  }

  getById(id: string): Observable<AspNetRole> {
    return this.api.get<AspNetRole>(this.controller, id);
  }

  create(role: Partial<AspNetRole>): Observable<AspNetRole> {
    return this.api.post<AspNetRole>(this.controller, undefined, role);
  }

  update(id: string, role: Partial<AspNetRole>): Observable<AspNetRole> {
    return this.api.put<AspNetRole>(this.controller, id, role);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(this.controller, id);
  }
}
