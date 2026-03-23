import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AspNetRoleClaim } from '../../models/asp-net-role-claim.model';
import { AspNetRoleClaimsService } from '../../services/asp-net-role-claims.service';

@Component({
  selector: 'app-asp-net-role-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-role-claims.component.html',
  styleUrls: ['./asp-net-role-claims.component.scss']
})
export class AspNetRoleClaimsComponent {
  roleId = '';
  claims: AspNetRoleClaim[] = [];
  filtered: AspNetRoleClaim[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  form: { claimType: string; claimValue: string } = { claimType: '', claimValue: '' };

  constructor(private service: AspNetRoleClaimsService, private cdr: ChangeDetectorRef) {}

  load(): void {
    if (!this.roleId.trim()) return;
    this.loading = true;
    this.errorMsg = '';
    this.service.getClaims(this.roleId.trim())
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.claims = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load claims.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.claims.filter(r =>
      r.claimType?.toLowerCase().includes(q) || r.claimValue?.toLowerCase().includes(q)
    );
  }

  openAdd(): void { this.form = { claimType: '', claimValue: '' }; this.showModal = true; }

  save(): void {
    if (!this.roleId.trim() || !this.form.claimType.trim()) return;
    this.service.addClaim(this.roleId.trim(), this.form).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Add claim failed.'; this.cdr.detectChanges(); }
    });
  }

  remove(claim: AspNetRoleClaim): void {
    if (!confirm('Remove this claim?')) return;
    this.service.removeClaim(this.roleId.trim(), { claimType: claim.claimType, claimValue: claim.claimValue }).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Remove failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
