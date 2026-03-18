import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AspNetUserLogin } from '../../models/asp-net-user-login.model';
import { AspNetUserLoginsService } from '../../services/asp-net-user-logins.service';

@Component({
  selector: 'app-asp-net-user-logins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-user-logins.component.html',
  styleUrls: ['./asp-net-user-logins.component.scss']
})
export class AspNetUserLoginsComponent implements OnInit {
  logins: AspNetUserLogin[] = [];
  filtered: AspNetUserLogin[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetUserLogin> = {};
  editOriginal: { loginProvider: string; providerKey: string } | null = null;

  constructor(private service: AspNetUserLoginsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: data => { this.logins = data; this.applySearch(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load data.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.logins.filter(r =>
      r.userId?.toLowerCase().includes(q) ||
      r.loginProvider?.toLowerCase().includes(q) ||
      r.providerDisplayName?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.isEdit = false; this.form = {}; this.editOriginal = null; this.showModal = true; }

  openEdit(row: AspNetUserLogin): void {
    this.isEdit = true;
    this.form = { ...row };
    this.editOriginal = { loginProvider: row.loginProvider, providerKey: row.providerKey };
    this.showModal = true;
  }

  save(): void {
    if (this.isEdit && this.editOriginal) {
      this.service.update(this.editOriginal.loginProvider, this.editOriginal.providerKey, this.form).subscribe({
        next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; }
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; }
      });
    }
  }

  delete(loginProvider: string, providerKey: string): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(loginProvider, providerKey).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Delete failed.'; } });
  }

  closeModal(): void { this.showModal = false; }
}
