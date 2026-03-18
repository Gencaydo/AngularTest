import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AspNetUserClaim } from '../models/asp-net-user-claim.model';

@Injectable({ providedIn: 'root' })
export class AspNetUserClaimsService {
  private controller = 'AspNetUserClaims';

  constructor(private api: ApiService) {}

  getAll(): Observable<AspNetUserClaim[]> {
    return this.api.get<AspNetUserClaim[]>(this.controller);
  }

  getById(id: number): Observable<AspNetUserClaim> {
    return this.api.get<AspNetUserClaim>(this.controller, String(id));
  }

  create(claim: Partial<AspNetUserClaim>): Observable<AspNetUserClaim> {
    return this.api.post<AspNetUserClaim>(this.controller, undefined, claim);
  }

  update(id: number, claim: Partial<AspNetUserClaim>): Observable<AspNetUserClaim> {
    return this.api.put<AspNetUserClaim>(this.controller, String(id), claim);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(this.controller, String(id));
  }
}
