import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
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

  constructor(private service: AspNetUsersService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.service.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: data => { this.users = data; this.applySearch(); },
        error: () => { this.errorMsg = 'Failed to load users.'; }
      });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = this.users.filter(u =>
      u.userName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }

  delete(id: string): void {
    if (!confirm('Delete this user?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => { this.errorMsg = 'Delete failed.'; this.cdr.detectChanges(); }
    });
  }
}
