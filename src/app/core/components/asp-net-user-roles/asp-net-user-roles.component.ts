import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AspNetUserRole } from '../../models/asp-net-user-role.model';
import { AspNetUserRolesService } from '../../services/asp-net-user-roles.service';

@Component({
  selector: 'app-asp-net-user-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asp-net-user-roles.component.html',
  styleUrls: ['./asp-net-user-roles.component.scss']
})
export class AspNetUserRolesComponent implements OnInit {
  userRoles: AspNetUserRole[] = [];
  filtered: AspNetUserRole[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  form: Partial<AspNetUserRole> = {};

  constructor(private service: AspNetUserRolesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.userRoles = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load data.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.userRoles.filter(r =>
      r.userId?.toLowerCase().includes(q) || r.roleId?.toLowerCase().includes(q)
    );
  }

  openCreate(): void { this.form = {}; this.showModal = true; }

  save(): void {
    this.service.create(this.form).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Save failed.'; this.cdr.detectChanges(); }
    });
  }

  delete(userId: string, roleId: string): void {
    if (!confirm('Delete this record?')) return;
    this.service.delete(userId, roleId).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Delete failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
