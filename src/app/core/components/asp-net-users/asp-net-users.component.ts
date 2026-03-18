import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AspNetUser } from '../../models/asp-net-user.model';
import { AspNetUsersService } from '../../services/asp-net-users.service';

@Component({
  selector: 'app-asp-net-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-users.component.html',
  styleUrls: ['./asp-net-users.component.scss']
})
export class AspNetUsersComponent implements OnInit {
  users: AspNetUser[] = [];
  filtered: AspNetUser[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetUser> = {};

  constructor(private service: AspNetUsersService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll().subscribe({
      next: data => { this.users = data; this.applySearch(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load data.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.users.filter(u =>
      u.userName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.isEdit = false; this.form = { emailConfirmed: false, phoneNumberConfirmed: false, twoFactorEnabled: false, lockoutEnabled: false, accessFailedCount: 0 }; this.showModal = true; }

  openEdit(row: AspNetUser): void { this.isEdit = true; this.form = { ...row }; this.showModal = true; }

  save(): void {
    const action = this.isEdit
      ? this.service.update(this.form.id!, this.form)
      : this.service.create(this.form);
    action.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => { this.errorMsg = 'Save failed.'; } });
  }

  delete(id: string): void {
    if (!confirm('Delete this user?')) return;
    this.service.delete(id).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Delete failed.'; } });
  }

  closeModal(): void { this.showModal = false; }
}
