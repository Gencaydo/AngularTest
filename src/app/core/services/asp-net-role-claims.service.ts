import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetRoleClaim } from '../models/asp-net-role-claim.model';

@Injectable({ providedIn: 'root' })
export class AspNetRoleClaimsService {
  private controller = 'Role';

  constructor(private api: ApiService) {}

  getClaims(roleId: string): Observable<AspNetRoleClaim[]> {
    return this.api.get<AspNetRoleClaim[]>(this.controller, `GetClaims/${roleId}`);
  }

  addClaim(roleId: string, claim: { claimType: string; claimValue: string }): Observable<AspNetRoleClaim> {
    return this.api.post<AspNetRoleClaim>(this.controller, `AddClaim/${roleId}`, claim);
  }

  removeClaim(roleId: string, claim: { claimType: string; claimValue: string }): Observable<void> {
    return this.api.delete<void>(this.controller, `RemoveClaim/${roleId}`, claim);
  }
}
