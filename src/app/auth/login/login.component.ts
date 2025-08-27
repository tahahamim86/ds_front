import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message = '';
  isLoading = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.message = '⚠️ Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        console.log('✅ Login successful:', response);

        if (response.jwt) {
          localStorage.setItem('auth_token', response.jwt); // Store JWT Token
          this.router.navigate(['']); // Redirect to dashboard
        } else {
          this.message = 'Unexpected error. Please try again.';
        }

        this.isLoading = false;
      },
      error: err => {
        console.error('❌ Login failed:', err);
        this.message = err.status === 403
          ? '🚫 Invalid credentials. Please try again.'
          : '⚠️ An error occurred. Please try later.';

        this.isLoading = false;
      }
    });
  }

  openDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '550px',
      height: '565px'
    });
  }
}
