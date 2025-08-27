import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent {

  passwordForm!: FormGroup;
  confirmPasswordForm!: FormGroup;
  currentStep = 0;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]] // Example validation
    });

    this.confirmPasswordForm = this.fb.group({
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator.bind(this) }); // Custom validator
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('confirmPassword')?.value;
    const confirmPassword = group.get('newPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordsDontMatch: true };
  }


  nextStep(stepper: MatStepper) {
    if (this.currentStep === 0 && this.passwordForm.valid) {
      stepper.next();
    } else if (this.currentStep === 1 && this.confirmPasswordForm.valid) {
      this.resetPassword();
    } else {
       // Optional: Display specific error messages for invalid form fields.
      if (this.currentStep === 0) {
        Object.values(this.passwordForm.controls).forEach(control => {
          control.markAsTouched();
          control.updateValueAndValidity(); // Trigger validation messages
        });
      } else if (this.currentStep === 1) {
        Object.values(this.confirmPasswordForm.controls).forEach(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
        });
      }
    }
  }

  resetPassword() {
    // Here you would typically make an API call to update the password.
    console.log("New Password:", this.passwordForm.get('newPassword')?.value);

    // Simulate API call delay
    setTimeout(() => {
      this.snackBar.open('Password updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'] // Custom CSS class for styling
      });
      this.passwordForm.reset();
      this.confirmPasswordForm.reset();
      this.currentStep = 0; // Reset the stepper
    }, 1000); // 1-second delay


  }

  previousStep(stepper: MatStepper) {
    stepper.previous();
  }
}
