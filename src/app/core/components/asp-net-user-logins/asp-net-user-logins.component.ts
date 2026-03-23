import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
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

  constructor(private service: AspNetUserLoginsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.logins = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load data.'; }
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
    const action = this.isEdit && this.editOriginal
      ? this.service.update(this.editOriginal.loginProvider, this.editOriginal.providerKey, this.form)
      : this.service.create(this.form);
    action.subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Save failed.'; this.cdr.detectChanges(); }
    });
  }

  delete(loginProvider: string, providerKey: string): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(loginProvider, providerKey).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Delete failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
