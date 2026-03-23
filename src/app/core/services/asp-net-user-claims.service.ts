import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserClaim } from '../models/asp-net-user-claim.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserClaimsService {
  private controller = 'User';

  constructor(private api: ApiService) {}

  getClaims(userId: string): Observable<AspNetUserClaim[]> {
    return this.api.get<AspNetUserClaim[]>(this.controller, `GetUserClaims/${userId}`);
  }

  addClaim(claim: { userId: string; claimType: string; claimValue: string }): Observable<AspNetUserClaim> {
    return this.api.post<AspNetUserClaim>(this.controller, 'AddUserClaim', claim);
  }

  removeClaim(claim: { userId: string; claimType: string; claimValue: string }): Observable<void> {
    return this.api.delete<void>(this.controller, 'RemoveUserClaim', claim);
  }
}
