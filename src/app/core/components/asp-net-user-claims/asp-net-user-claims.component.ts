import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AspNetUserClaim } from '../../models/asp-net-user-claim.model';
import { AspNetUserClaimsService } from '../../services/asp-net-user-claims.service';

@Component({
  selector: 'app-asp-net-user-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-user-claims.component.html',
  styleUrls: ['./asp-net-user-claims.component.scss']
})
export class AspNetUserClaimsComponent {
  userId = '';
  claims: AspNetUserClaim[] = [];
  filtered: AspNetUserClaim[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  form: { claimType: string; claimValue: string } = { claimType: '', claimValue: '' };

  constructor(private service: AspNetUserClaimsService, private cdr: ChangeDetectorRef) {}

  load(): void {
    if (!this.userId.trim()) return;
    this.loading = true;
    this.errorMsg = '';
    this.service.getClaims(this.userId.trim())
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.claims = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load claims.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.claims.filter(c =>
      c.claimType?.toLowerCase().includes(q) || c.claimValue?.toLowerCase().includes(q)
    );
  }

  openAdd(): void { this.form = { claimType: '', claimValue: '' }; this.showModal = true; }

  save(): void {
    if (!this.userId.trim() || !this.form.claimType.trim()) return;
    this.service.addClaim({ userId: this.userId.trim(), ...this.form }).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Add claim failed.'; this.cdr.detectChanges(); }
    });
  }

  remove(claim: AspNetUserClaim): void {
    if (!confirm('Remove this claim?')) return;
    this.service.removeClaim({ userId: this.userId.trim(), claimType: claim.claimType, claimValue: claim.claimValue }).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Remove failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
