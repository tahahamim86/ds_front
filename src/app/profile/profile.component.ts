import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData = [
    { key: 'fullName', label: 'Full Name', value: '', type: 'text' },
    { key: 'birthday', label: 'Date of Birth', value: '', type: 'date' },
    { key: 'placeBirth', label: 'Place of Birth', value: '', type: 'text' },
    { key: 'identityMatricule', label: 'Matricule', value: '', type: 'text' },
    { key: 'codeNam', label: 'Code Nom', value: '', type: 'text' },
    { key: 'contacttype', label: 'Contact Type', value: '', type: 'text' },
    { key: 'contactInfo', label: 'Contact Info', value: '', type: 'email' },
    { key: 'martialstatus', label: 'Marital Status', value: '', type: 'text' },
    { key: 'description_martialstatus', label: 'Description', value: '', type: 'text' },
    { key: 'nationality', label: 'Nationality', value: '', type: 'text' },
    { key: 'gender', label: 'Gender', value: '', type: 'text' }
  ];
  isEditing: { [key: string]: boolean } = {};
  showUpdateButton: boolean = false;
  profileImage: string = 'assets/images/avatar.png';
  profileExists: boolean = false;
  confirmDelete: boolean = false;
  age: number | null = null;
  selectedFile: File | null = null;

  // To manage animated icon logic
  showAnimatedIcon: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = this.authService.getToken();
    if (token) {
      this.profileService.getProfile().subscribe(
        (profile) => {
          if (profile) {
            this.profileExists = true;
            this.profileData.forEach(item => {
              item.value = profile[item.key] || '';
            });
            this.profileImage = profile.image ? 'data:image/png;base64,' + profile.image : this.profileImage;
            this.calculateAge();
          }
        },
        (error) => {
          console.error('Error loading profile:', error);
          this.profileExists = false;
          alert('Error loading profile. Please try again later.');
        }
      );
    }
  }

  toggleEdit(key: string): void {
    this.isEditing[key] = !this.isEditing[key];
    this.checkUpdateButtonVisibility();
  }

  updateProfile(): void {
    const token = this.authService.getToken();
    if (token) {
      const profilePayload = this.profileData.reduce((obj, item) => {
        let value = item.value;
        if (item.key === 'martialstatus') {
          value = value.trim();
        }
        if (item.key === 'gender' && !['male', 'female', 'other'].includes(value.toLowerCase())) {
          value = 'other';
        }
        obj[item.key] = value;
        return obj;
      }, {} as any);

      console.log('profilePayload before update service call:', profilePayload); // Log the payload

      // Log the selected file information for update
      if (this.selectedFile) {
        console.log('Selected File (update):', { name: this.selectedFile.name, size: this.selectedFile.size, type: this.selectedFile.type });
      } else {
        console.log('No file selected for update.');
      }

      this.profileService.updateProfile(profilePayload, this.selectedFile).subscribe(
        (updatedProfile) => {
          this.afterSaveSuccess(updatedProfile);
          alert('Profile updated successfully!');
          this.showAnimatedSave(); // Show animation
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile. Please try again later.');
        }
      );
    }
  }

  createProfile(): void {
    const token = this.authService.getToken();
    if (token) {
      const profilePayload = this.profileData.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {} as any);

      const email = this.authService.getUserId();
      if (email) {
        profilePayload['email'] = email;
      }

      console.log('profilePayload before service call:', profilePayload); // Log the payload

      // Log the selected file information
      if (this.selectedFile) {
        console.log('Selected File:', { name: this.selectedFile.name, size: this.selectedFile.size, type: this.selectedFile.type });
      } else {
        console.log('No file selected.');
      }

      this.profileService.createProfile(profilePayload, this.selectedFile).subscribe(
        (createdProfile) => {
          this.afterSaveSuccess(createdProfile);
          this.profileExists = true;
          alert('Profile created successfully!');
          this.showAnimatedSave();
        },
        (error) => {
          console.error('Error creating profile:', error);
          alert('Error creating profile. Please try again later.');
        }
      );
    }
  }

  afterSaveSuccess(profile: any): void {
    this.profileData.forEach(item => {
      item.value = profile[item.key] || '';
      this.isEditing[item.key] = false;
    });
    this.profileImage = profile.image ? 'data:image/png;base64,' + profile.image : 'assets/images/myimg.png';
    this.selectedFile = null;
    this.checkUpdateButtonVisibility();
    this.calculateAge();
  }

  checkUpdateButtonVisibility(): void {
    this.showUpdateButton = Object.values(this.isEditing).some(editing => editing);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  calculateAge(): void {
    const birthdayString = this.profileData.find(item => item.key === 'birthday')?.value;
    if (birthdayString) {
      const birthday = new Date(birthdayString);
      const today = new Date();
      let age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      this.age = age;
    } else {
      this.age = null;
    }
  }

  deleteProfile(): void {
    if (this.confirmDelete) {
      const token = this.authService.getToken();
      if (token) {
        this.profileService.deleteProfile().subscribe(
          () => {
            this.profileExists = false;
            this.resetProfile();
            alert('Profile deleted successfully!');
          },
          (error) => {
            console.error('Error deleting profile:', error);
            alert('Error deleting profile. Please try again later.');
          }
        );
      }
    } else {
      this.confirmDelete = true;
      alert('Click delete again to confirm!');
    }
  }

  cancelDelete(): void {
    this.confirmDelete = false;
  }

  resetProfile(): void {
    this.profileData.forEach(item => item.value = '');
    this.profileImage = 'assets/images/myimg.png';
    this.age = null;
    this.isEditing = {};
    this.showUpdateButton = false;
    this.selectedFile = null;
    this.confirmDelete = false;
  }

  showAnimatedSave(): void {
    this.showAnimatedIcon = true;
    setTimeout(() => {
      this.showAnimatedIcon = false;
    }, 2000); // Show animation for 2 seconds
  }
}
