import { Component } from '@angular/core';
import { ImageVerifService } from '../services/ImageVerif.service';
import { DiagnosisService } from '../services/diagnosis.service';
import { DiagnosisManagementService } from '../services/diagnosis_management.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-retinopathy',
  templateUrl: './retinopathy.component.html',
  styleUrls: ['./retinopathy.component.css']
})
export class RetinopathyComponent {

 previewImage: string | ArrayBuffer | null = null;
  predictionClass: string | null = null;
  accuracy = 0;
  isScanning = false;
  accuracyOffset = 251.2;
  selectedFile: File | null = null; // Store the selected file

  textList: any;

  constructor(private authService:AuthServiceService,private imageVerifService: ImageVerifService, private diagnosis:DiagnosisService, private diagnosisManagement:DiagnosisManagementService) {}



  /** Opens the file upload modal */
  openModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  /** Closes the file upload modal */
  closeModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  /** Handles file selection */
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0]; // Store selected file

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result; // Store image preview
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  /** Calls the API to verify image similarity */
  verifyImages(): void {
    if (!this.selectedFile) {
      console.error('ImageB is required for verification.');
      return;
    }

    this.imageVerifService.VerifImageRetinopathy(this.selectedFile).subscribe(
      response => {
        console.log('Comparison Result:', response);
        this.predictionClass = response.message; // Update UI with response

        if (response.SSIM_score < 0.5) {
          alert('Please provide an image that represents diabetic retinopathy for a better understanding and experience with this type of diagnosis');
        } else {
          alert('Image successfully verified');
        }
      },
      error => {
        console.error('API Error:', error);
        alert('An error occurred while verifying the image. Please try again.');
      }
    );
  }

showResult =false;
  /** Starts fake analysis (for UI effect) and then calls `verifyImages()` */
  startAnalysis() {
    if (!this.selectedFile) {
      alert('Please add retinopathy image to avoid problems.');
      return;
    }

    this.isScanning = true;
    this.accuracy = 0;
    this.accuracyOffset = 251.2; // Reset accuracy bar

    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 10;
      this.accuracy = progress;
      this.accuracyOffset = 251.2 - (progress / 100) * 251.2;

      if (progress >= 100) {
        clearInterval(scanInterval);
        this.isScanning = false;
        this.verifyImages();
        this.retinalDiagnosis();
        this.showResult=!this.showResult;
      }
    }, 300);
  }


  displayedText: string = ""; // Stores typed text
  currentIndex = 0;
  class: number = 0;
  description_disease: string = "";
  severe: string = '';
  
  ngOnInit(): void {
    this.startTypingEffect();
  }
  
  startTypingEffect() {
    this.displayedText = ""; // Reset displayed text
    this.typeText(0); // Start typing effect
  }
  
  typeText(charIndex: number) {
    if (!this.description_disease || charIndex >= this.description_disease.length) return; // Stop when all text is typed
  
    let typingInterval = setInterval(() => {
      if (charIndex < this.description_disease.length) {
        this.displayedText += this.description_disease[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Typing speed (adjustable)
  }
  
  retinalDiagnosis(): void {
    if (!this.selectedFile) {
      console.error('Image is required for verification.');
      return;
    }
  
    this.diagnosis.retinopathydiagnosis(this.selectedFile).subscribe(
      response => {
        this.class = response.class;
        this.severe = response.disease;
        this.description_disease = response.explanation;
        this.startTypingEffect(); 
        console.log(response);
      },
      error => {
        console.error('API Error:', error);
        alert('An error occurred while verifying the image. Please try again.');
      }
    );
  }
  date= new Date()
text=""
  imageFile!: File;
  saveDiagnosis(): void {
    // Ensure that an image, prediction, and text have been completed

    if (!this.selectedFile || !this.predictionClass || !this.text) {
      alert('Please make sure an image is selected and analysis has been completed.');
      return;
    }
  

    // Get the email from the AuthService
    const email = this.authService.getUserId();
  
    // Check if the email is null or undefined
    if (!email) {
      alert('User email is not found!');
      return;
    }
  
    // Log the selected file for debugging purposes
    console.log('Selected File for Diagnosis:', this.selectedFile);
  
    // Check if the selected file is a valid image type (JPEG, PNG, etc.)
    if (!this.selectedFile.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, etc.).');
      return;
    }
  
    // Optionally, check the size (max 5MB in this example)
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (this.selectedFile.size > maxSizeInBytes) {
      alert(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      return;
    }
  
    // Prepare the FormData to send
    const formData = new FormData();
    formData.append('diagnosis_Date', new Date().toISOString().split('T')[0]); // yyyy-MM-dd format
    formData.append('disease_name', this.text); // The disease name from the prediction
    formData.append('diagnostic_details', this.textList.join(', ')); // Join textList for a readable string
  
    // Append the selected image file to the FormData
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Append image file
      console.log('Image File Appended:', this.selectedFile);  // Log file before sending for debugging
    } else {
      console.error('Selected file is not available.');
      return;
    }
  
    // Attach the user's email to the FormData
    formData.append('email', email);
  
    // Log the FormData before sending it to diagnose
    console.log('Form Data being sent:', formData);
  
    // Send the form data to the diagnosis management service

    this.diagnosisManagement.addDiagnosis(formData).subscribe({
      next: (res) => {
        alert('Diagnosis saved successfully!');
      },
      error: (err) => {

        // Log error and show a user-friendly alert
        console.error('Error saving diagnosis:', err);
        alert('Error saving diagnosis. Please check the details and try again.');
      }
    });
  }

}