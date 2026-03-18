import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AspNetRole } from '../../models/asp-net-role.model';
import { AspNetRolesService } from '../../services/asp-net-roles.service';

@Component({
  selector: 'app-asp-net-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-roles.component.html',
  styleUrls: ['./asp-net-roles.component.scss']
})
export class AspNetRolesComponent implements OnInit {
  roles: AspNetRole[] = [];
  filtered: AspNetRole[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  isEdit = false;
  form: Partial<AspNetRole> = {};

  constructor(private service: AspNetRolesService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll().subscribe({
      next: data => { this.roles = data; this.applySearch(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load data.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.roles.filter(r =>
      r.name?.toLowerCase().includes(q) || r.normalizedName?.toLowerCase().includes(q)
    );
  }

  openCreate(): void {
    this.isEdit = false;
    this.form = {};
    this.showModal = true;
  }

  openEdit(role: AspNetRole): void {
    this.isEdit = true;
    this.form = { ...role };
    this.showModal = true;
  }

  save(): void {
    if (this.isEdit && this.form.id) {
      this.service.update(this.form.id, this.form).subscribe({
        next: () => { this.showModal = false; this.load(); },
        error: () => { this.errorMsg = 'Update failed.'; }
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.showModal = false; this.load(); },
        error: () => { this.errorMsg = 'Create failed.'; }
      });
    }
  }

  delete(id: string): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Delete failed.'; }
    });
  }

  closeModal(): void { this.showModal = false; }
}
