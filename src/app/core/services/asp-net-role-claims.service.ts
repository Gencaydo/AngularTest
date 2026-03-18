import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetRoleClaim } from '../models/asp-net-role-claim.model';

@Injectable({ providedIn: 'root' })
export class AspNetRoleClaimsService {
  private controller = 'AspNetRoleClaims';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetRoleClaim[]> {
    return this.api.get<AspNetRoleClaim[]>(this.controller);
  }

  getById(id: number): Observable<AspNetRoleClaim> {
    return this.api.get<AspNetRoleClaim>(this.controller, String(id));
  }

  create(claim: Partial<AspNetRoleClaim>): Observable<AspNetRoleClaim> {
    return this.api.post<AspNetRoleClaim>(this.controller, undefined, claim);
  }

  update(id: number, claim: Partial<AspNetRoleClaim>): Observable<AspNetRoleClaim> {
    return this.api.put<AspNetRoleClaim>(this.controller, String(id), claim);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(this.controller, String(id));
  }
}
