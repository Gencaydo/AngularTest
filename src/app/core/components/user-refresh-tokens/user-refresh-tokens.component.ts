import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRefreshToken } from '../../models/user-refresh-token.model';
import { UserRefreshTokensService } from '../../services/user-refresh-tokens.service';

@Component({
  selector: 'app-user-refresh-tokens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-refresh-tokens.component.html',
  styleUrls: ['./user-refresh-tokens.component.scss']
})
export class UserRefreshTokensComponent implements OnInit {
  tokens: UserRefreshToken[] = [];
  filtered: UserRefreshToken[] = [];
  searchTerm = '';
  loading = false;
  errorMsg = '';

  constructor(private service: UserRefreshTokensService) {}

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
      r.userId?.toLowerCase().includes(q) || r.token?.toLowerCase().includes(q)
    );
  }

  revoke(id: number): void {
    if (!confirm('Revoke this token?')) return;
    this.service.revoke(id).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Revoke failed.'; } });
  }

  delete(id: number): void {
    if (!confirm('Delete this token?')) return;
    this.service.delete(id).subscribe({ next: () => this.load(), error: () => { this.errorMsg = 'Delete failed.'; } });
  }
}
