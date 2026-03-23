import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class AspNetUserClaimsComponent implements OnInit {
  claims: AspNetUserClaim[] = [];
  filtered: AspNetUserClaim[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetUserClaim> = {};

  constructor(private service: AspNetUserClaimsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.claims = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load data.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.claims.filter(r =>
      r.userId?.toLowerCase().includes(q) ||
      r.claimType?.toLowerCase().includes(q) ||
      r.claimValue?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.isEdit = false; this.form = {}; this.showModal = true; }
  openEdit(row: AspNetUserClaim): void { this.isEdit = true; this.form = { ...row }; this.showModal = true; }

  save(): void {
    const action = this.isEdit ? this.service.update(this.form.id!, this.form) : this.service.create(this.form);
    action.subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Save failed.'; this.cdr.detectChanges(); }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Delete failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
