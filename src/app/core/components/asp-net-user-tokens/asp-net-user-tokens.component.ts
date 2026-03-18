import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AspNetUserToken } from '../../models/asp-net-user-token.model';
import { AspNetUserTokensService } from '../../services/asp-net-user-tokens.service';

@Component({
  selector: 'app-asp-net-user-tokens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-user-tokens.component.html',
  styleUrls: ['./asp-net-user-tokens.component.scss']
})
export class AspNetUserTokensComponent implements OnInit {
  tokens: AspNetUserToken[] = [];
  filtered: AspNetUserToken[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetUserToken> = {};
  editOriginal: { userId: string; loginProvider: string; name: string } | null = null;

  constructor(private service: AspNetUserTokensService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: data => { this.tokens = data; this.applySearch(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load data.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.tokens.filter(r =>
      r.userId?.toLowerCase().includes(q) ||
      r.loginProvider?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.isEdit = false; this.form = {}; this.editOriginal = null; this.showModal = true; }

  openEdit(row: AspNetUserToken): void {
    this.isEdit = true;
    this.form = { ...row };
    this.editOriginal = { userId: row.userId, loginProvider: row.loginProvider, name: row.name };
    this.showModal = true;
  }

  save(): void {
    if (this.isEdit && this.editOriginal) {
      this.service.update(this.editOriginal.userId, this.editOriginal.loginProvider, this.editOriginal.name, this.form).subscribe({
        next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; }
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; }
      });
    }
  }

  delete(userId: string, loginProvider: string, name: string): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(userId, loginProvider, name).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Delete failed.'; } });
  }

  closeModal(): void { this.showModal = false; }
}
