import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class IndexComponent implements OnInit {
  welcomeMessage: string = '';
  userEmail: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Get the login response data from localStorage
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      this.welcomeMessage = parsedData.message || 'Welcome back!';
      this.userEmail = parsedData.email || '';
    }
  }

  onLogout() {
    this.loginService.logout().subscribe({
      next: () => {
        // Clear all local storage
        localStorage.clear();
        // Navigate to login page
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if there's an error, clear storage and redirect
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
} 