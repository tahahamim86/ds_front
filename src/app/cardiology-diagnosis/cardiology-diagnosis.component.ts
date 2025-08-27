import { Component, OnInit } from '@angular/core';
import { ImageVerifService } from '../services/ImageVerif.service';
import { DiagnosisService } from '../services/diagnosis.service';
import { DiagnosisManagementService } from '../services/diagnosis_management.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute to get userId from route
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-cardiology-diagnosis',
  templateUrl: './cardiology-diagnosis.component.html',
  styleUrls: ['./cardiology-diagnosis.component.css']
})
export class CardiologyDiagnosisComponent implements OnInit {
  previewImage: string | ArrayBuffer | null = null;
  predictionClass: string | null = null;
  accuracy = 0;
  isScanning = false;
  accuracyOffset = 251.2;
  selectedFile: File | null = null; // Store the selected file

  resultB: number = 0;
  index = 0;
  Heartdiseases = ['Normal', 'Cardiology'];
  text = '';
  showResult = false;

  // For typing effect
  textList: string[] = [
    "Your cardiology diagnosis is normal. No signs of abnormalities were detected.",
    "Maintain a healthy lifestyle and consult your doctor for regular check-ups."
  ];

  displayedText: string[] = Array(this.textList.length).fill(""); // Stores typed text
  currentIndex = 0;

  date = new Date();

  imageFile!: File;

  constructor(
    private imageVerifService: ImageVerifService,
    private diagnosis: DiagnosisService,
    private diagnosisManagement: DiagnosisManagementService,
    private route: ActivatedRoute,
    private authService: AuthServiceService // Inject AuthService to access email
  ) { }

  ngOnInit(): void {
    this.startTypingEffect();
  }

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

      // Log the selected file to ensure it's set
      console.log('Selected File:', this.selectedFile);

      // Check if the file type is an image
      console.log('File Type:', this.selectedFile.type);  // This will log the file type

      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.).');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result; // Store image preview
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.error('No file selected');
    }
  }

  /** Calls the API to verify image similarity */
  verifyImages(): void {
    if (!this.selectedFile) {
      console.error('ImageB is required for verification.');
      return;
    }

    this.imageVerifService.VerifImageChest(this.selectedFile).subscribe(
      response => {
        console.log('Comparison Result:', response);
        this.predictionClass = response.message; // Update UI with response

        if (response.SSIM_score < 0.5) {
          alert('Please provide an image that represents a CHEST XRAY IMAGE for a better understanding and experience with this type of diagnosis');
        }
      },
      error => {
        console.error('API Error:', error);
        alert('An error occurred while verifying the image. Please try again.');
      }
    );
  }

  /** Performs cardiology diagnosis */
 cardiologyDiagnosis(): void {
  if (!this.selectedFile) {
    console.error('ImageB is required for verification.');
    return;
  }

  this.diagnosis.cardiologydiagnosis(this.selectedFile).subscribe(
    response => {
      if (response) {
        this.resultB = response.class;
        this.index = this.resultB;
        this.text = this.Heartdiseases[this.index];

        console.log('Diagnosis:', this.text);
        console.log('Result Index:', this.resultB);

        // Update advice based on result
        if (this.text === 'Cardiology') {
          this.textList = [
            "Signs of potential heart disease were detected in your X-ray image.",
            "We strongly advise you to consult a cardiologist for further evaluation.",
            "Avoid strenuous activity until a professional gives you clearance.",
            "Follow a heart-healthy diet, reduce stress, and monitor symptoms like chest pain or fatigue."
          ];
        } else {
          this.textList = [
            "Your cardiology diagnosis is normal. No signs of abnormalities were detected.",
            "Maintain a healthy lifestyle and consult your doctor for regular check-ups."
          ];
        }

        // Reset and restart typing effect with updated advice
        this.displayedText = Array(this.textList.length).fill("");
        this.startTypingEffect();
      } else {
        console.error('Unexpected response format:', response);
        alert('Unexpected response from the server.');
      }
    },
    error => {
      console.error('API Error:', error);
      alert('An error occurred while verifying the image. Please try again.');
    }
  );
}

  /** Starts fake analysis (for UI effect) and then calls `verifyImages()` */
  startAnalysis() {
    if (!this.selectedFile) {
      alert('Please upload an X-ray image first.');
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
        this.cardiologyDiagnosis();
        this.showResult = !this.showResult;
      }
    }, 300);
  }

  /** Starts the typing effect */
  startTypingEffect() {
    this.typeText(0); // Start typing from the first text
  }

  /** Simulates typing effect for the diagnosis text */
  typeText(index: number) {
    if (index >= this.textList.length) return; // Stop when all text is typed

    let text = this.textList[index];
    let charIndex = 0;

    let typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.displayedText[index] += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => this.typeText(index + 1), 1000); // Delay before next text starts
      }
    }, 50); // Typing speed (adjustable)
  }

  /** Save diagnosis and image */
  /** Save diagnosis and image */
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
        this.getDiagnosis(email); // Optionally, fetch updated diagnoses for the specific user
      },
      error: (err) => {
        // Log error and show a user-friendly alert
        console.error('Error saving diagnosis:', err);
        alert('Error saving diagnosis. Please check the details and try again.');
      }
    });
  }



  /** Fetch diagnosis data (if needed) */
  getDiagnosis(email: string) {
    // Add logic to fetch the diagnosis for the user if needed
  }

}
