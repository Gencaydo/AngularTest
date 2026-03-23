import { ChangeDetectorRef, Component } from '@angular/core';
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
export class AspNetUserRolesComponent {
  userId = '';
  userRoles: AspNetUserRole[] = [];
  filtered: AspNetUserRole[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  showModal = false;
  form: { roleId: string } = { roleId: '' };

  constructor(private service: AspNetUserRolesService, private cdr: ChangeDetectorRef) {}

  load(): void {
    if (!this.userId.trim()) return;
    this.loading = true;
    this.errorMsg = '';
    this.service.getUserRoles(this.userId.trim())
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.userRoles = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load roles.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.userRoles.filter(r => r.roleId?.toLowerCase().includes(q));
  }

  openAdd(): void { this.form = { roleId: '' }; this.showModal = true; }

  save(): void {
    if (!this.userId.trim() || !this.form.roleId.trim()) return;
    this.service.addUserToRole({ userId: this.userId.trim(), roleId: this.form.roleId.trim() }).subscribe({
      next: () => { this.showModal = false; this.load(); },
      error: () => { this.errorMsg = 'Add role failed.'; this.cdr.detectChanges(); }
    });
  }

  remove(roleId: string): void {
    if (!confirm('Remove this role from user?')) return;
    this.service.removeUserFromRole({ userId: this.userId.trim(), roleId }).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Remove failed.'; this.cdr.detectChanges(); }
    });
  }

  closeModal(): void { this.showModal = false; }
}
