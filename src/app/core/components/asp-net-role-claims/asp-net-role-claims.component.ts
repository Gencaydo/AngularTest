import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AspNetRoleClaim } from '../../models/asp-net-role-claim.model';
import { AspNetRoleClaimsService } from '../../services/asp-net-role-claims.service';

@Component({
  selector: 'app-asp-net-role-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-role-claims.component.html',
  styleUrls: ['./asp-net-role-claims.component.scss']
})
export class AspNetRoleClaimsComponent implements OnInit {
  claims: AspNetRoleClaim[] = [];
  filtered: AspNetRoleClaim[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetRoleClaim> = {};

  constructor(private service: AspNetRoleClaimsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll().subscribe({
      next: data => { this.claims = data; this.applySearch(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load data.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.claims.filter(r =>
      r.roleId?.toLowerCase().includes(q) ||
      r.claimType?.toLowerCase().includes(q) ||
      r.claimValue?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.isEdit = false; this.form = {}; this.showModal = true; }

  openEdit(row: AspNetRoleClaim): void { this.isEdit = true; this.form = { ...row }; this.showModal = true; }

  save(): void {
    const action = this.isEdit
      ? this.service.update(this.form.id!, this.form)
      : this.service.create(this.form);
    action.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; } });
  }

  delete(id: number): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(id).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Delete failed.'; } });
  }

  closeModal(): void { this.showModal = false; }
}
