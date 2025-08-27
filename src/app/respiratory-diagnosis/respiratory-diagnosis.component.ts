import { Component } from '@angular/core';
import { ImageVerifService } from '../services/ImageVerif.service';
import { DiagnosisManagementService } from '../services/diagnosis_management.service';

import { AuthServiceService } from '../services/auth-service.service';
import { DiagnosisService } from '../services/diagnosis.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-respiratory-diagnosis',
  templateUrl: './respiratory-diagnosis.component.html',
  styleUrls: ['./respiratory-diagnosis.component.css']
})
export class RespiratoryDiagnosisComponent {

  previewImage: string | ArrayBuffer | null = null;
  predictionClass: string | null = null;
  accuracy = 0;
  isScanning = false;
  accuracyOffset = 251.2;
  selectedFile: File | null = null; // Store the selected file

  resultB: number = 0;
  index = 0;
 text: string = '';
  showResult: boolean = false;
  // Array of possible class labels returned by your model/service
  Heartdiseases = [
    "COVID", 
    "Lung Opacity", 
    "Normal", 
    "Tuberculosis", 
    "Viral Pneumonia", 
    "Atelectasis", 
    "Fibrosis", 
    "Hernia"
  ];

  // Corresponding detailed descriptions for each class (same order)
  textList: string[] = [
    "COVID: A respiratory illness caused by the SARS-CoV-2 virus. It can range from mild symptoms to severe pneumonia, acute respiratory distress syndrome (ARDS), and multi-organ failure.",
    "Lung Opacity: A radiological term indicating areas in the lungs that appear denser than normal on an X-ray, possibly due to infection, fluid, or other abnormalities.",
    "Normal: Indicates that the chest X-ray does not show signs of disease or abnormality; the lungs and surrounding structures appear healthy.",
    "Tuberculosis: A contagious bacterial infection caused by Mycobacterium tuberculosis, usually affecting the lungs and characterized by chronic cough, weight loss, and night sweats.",
    "Viral Pneumonia: Inflammation of the lungs caused by a viral infection, leading to symptoms such as fever, cough, shortness of breath, and chest pain.",
    "Atelectasis: Collapse or incomplete expansion of part or all of a lung, reducing the lung's ability to exchange oxygen and carbon dioxide.",
    "Fibrosis: Thickening and scarring of lung tissue, often from chronic inflammation, which causes stiff lungs and difficulty in breathing.",
    "Hernia: In chest radiology, usually refers to a diaphragmatic hernia, where abdominal organs push into the chest cavity, potentially impairing lung function."
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
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.startTypingEffect();
  }

  openModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];

      console.log('Selected File:', this.selectedFile);
      console.log('File Type:', this.selectedFile.type);

      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.).');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.error('No file selected');
    }
  }

  verifyImages(): void {
    if (!this.selectedFile) {
      console.error('ImageB is required for verification.');
      return;
    }

    this.imageVerifService.VerifImageChest(this.selectedFile).subscribe(
      response => {
        console.log('Comparison Result:', response);
        this.predictionClass = response.message;

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
class_name="";
  cardiologyDiagnosis(): void {
    if (!this.selectedFile) {
      console.error('ImageB is required for verification.');
      return;
    }

    this.diagnosis.respiratorydiagnosis(this.selectedFile).subscribe(
      response => {
        if (response) {
          this.resultB = response.class;
          this.index = this.resultB;

          // Defensive: Check bounds
          if (this.index >= 0 && this.index < this.Heartdiseases.length) {
            // Use the class name
            const predictedClassName = this.Heartdiseases[this.index];
            // Find the description that matches the predicted class name
            // Since arrays are aligned, index corresponds directly to textList
            this.class_name=predictedClassName;
            this.text = this.textList[this.index];
            console.log('Predicted Class:', predictedClassName);
            console.log('Diagnosis Description:', this.text);
          } else {
            console.error('Prediction index out of bounds:', this.index);
            this.text = 'Unknown diagnosis result';
          }
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

  startAnalysis() {
    if (!this.selectedFile) {
      alert('Please upload an X-ray image first.');
      return;
    }

    this.isScanning = true;
    this.accuracy = 0;
    this.accuracyOffset = 251.2;

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

  startTypingEffect() {
    this.typeText(0);
  }

  typeText(index: number) {
    if (index >= this.textList.length) return;

    let text = this.textList[index];
    let charIndex = 0;

    let typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.displayedText[index] += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => this.typeText(index + 1), 1000);
      }
    }, 50);
  }

  saveDiagnosis(): void {
    if (!this.selectedFile || !this.predictionClass || !this.text) {
      alert('Please make sure an image is selected and analysis has been completed.');
      return;
    }

    const email = this.authService.getUserId();

    if (!email) {
      alert('User email is not found!');
      return;
    }

    console.log('Selected File for Diagnosis:', this.selectedFile);

    if (!this.selectedFile.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, etc.).');
      return;
    }

    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (this.selectedFile.size > maxSizeInBytes) {
      alert(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      return;
    }

    const formData = new FormData();
    formData.append('diagnosis_Date', new Date().toISOString().split('T')[0]);
    formData.append('disease_name', this.Heartdiseases[this.index]); // disease_name should be the class name
    formData.append('diagnostic_details', this.text); // save the detailed description

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      console.log('Image File Appended:', this.selectedFile);
    } else {
      console.error('Selected file is not available.');
      return;
    }

    formData.append('email', email);

    console.log('Form Data being sent:', formData);

    this.diagnosisManagement.addDiagnosis(formData).subscribe({
      next: (res) => {
        alert('Diagnosis saved successfully!');
        this.getDiagnosis(email);
      },
      error: (err) => {
        console.error('Error saving diagnosis:', err);
        alert('Error saving diagnosis. Please check the details and try again.');
      }
    });
  }

  getDiagnosis(email: string) {
    // Fetch diagnosis data for the user if needed
  }

}
