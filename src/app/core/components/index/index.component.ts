import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class IndexComponent implements OnInit {
  welcomeMessage: string = '';
  userEmail: string = '';

  ngOnInit() {
    // Get the login response data from localStorage
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      this.welcomeMessage = parsedData.message || 'Welcome back!';
      this.userEmail = parsedData.email || '';
    }
  }
} 