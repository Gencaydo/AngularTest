import { ChangeDetectorRef, Component } from '@angular/core';
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
export class AspNetUserLoginsComponent {
  userId = '';
  logins: AspNetUserLogin[] = [];
  filtered: AspNetUserLogin[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  constructor(private service: AspNetUserLoginsService, private cdr: ChangeDetectorRef) {}

  load(): void {
    if (!this.userId.trim()) return;
    this.loading = true;
    this.errorMsg = '';
    this.service.getUserLogins(this.userId.trim())
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.logins = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load logins.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.logins.filter(r =>
      r.loginProvider?.toLowerCase().includes(q) ||
      r.providerDisplayName?.toLowerCase().includes(q)
    );
  }

  remove(login: AspNetUserLogin): void {
    if (!confirm('Remove this login?')) return;
    this.service.removeUserLogin(login.userId, login.loginProvider, login.providerKey).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Remove failed.'; this.cdr.detectChanges(); }
    });
  }
}
