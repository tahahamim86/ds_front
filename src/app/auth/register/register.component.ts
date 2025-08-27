import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  First_name = '';
  Last_name = '';
  app_user_role = '';
  message = '';
  messageType: 'success' | 'danger' | 'warning' = 'warning';
  isLoading = false;

  constructor(private authService: AuthServiceService, private router: Router) {}

  register() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!this.email || !this.password || !this.First_name || !this.Last_name || !this.app_user_role) {
    this.messageType = 'warning';
    this.message = '⚠️ Please fill in all required fields.';
    return;
  }

  if (!emailRegex.test(this.email)) {
    this.messageType = 'danger';
    this.message = '❌ Please enter a valid email address.';
    return;
  }

  this.isLoading = true;
  this.message = '';

  this.authService.register(this.email, this.password, this.First_name, this.Last_name, this.app_user_role)
    .subscribe({
      next: token => {
        console.log('✅ Registration successful. Token:', token);

        this.messageType = 'success';
        this.message = '✅ Registration successful! Please check your email to verify your account.';

        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 3000);

        this.isLoading = false;
      },
      error: err => {
        console.error('❌ Registration failed:', err);
        this.messageType = 'danger';
        this.message = err.message || '❌ Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
}


  ngOnInit(): void {}
}
