import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlockTokenService } from '../services/block_token.service';

@Component({
  selector: 'app-token-modal',
  templateUrl: './tokenmodal.component.html',
  styleUrls: ['./tokenmodal.component.css']
})
export class TokenmodalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  token = '';
  hasToken = false;

  constructor(
    private router: Router,
    private tokenService: BlockTokenService
  ) {}

  ngOnInit(): void {
    this.tokenService.checkUserToken().subscribe({
      next: (res) => this.hasToken = res.has_token,
      error: (err) => alert('Error checking token: ' + err.message)
    });
  }

  handleTokenAction(): void {
    if (!this.token.trim()) {
      alert('Token cannot be empty');
      return;
    }

    const nextStep = () => {
      localStorage.setItem('medical_token', this.token);
      this.router.navigate(['/medical-docs']);
      this.close.emit();
    };

    if (this.hasToken) {
      this.tokenService.getUserDocs(this.token).subscribe({
        next: nextStep,
        error: () => alert('Invalid token')
      });
    } else {
      this.tokenService.setUserToken(this.token).subscribe({
        next: () => {
          alert('Token created successfully');
          nextStep();
        },
        error: (err) => alert('Failed to set token: ' + err.message)
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
