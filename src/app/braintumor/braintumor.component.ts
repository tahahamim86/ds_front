import { Component, OnInit } from '@angular/core';
import { ImageVerifService } from '../services/ImageVerif.service';
import { DiagnosisService } from '../services/diagnosis.service';
import { DiagnosisManagementService } from '../services/diagnosis_management.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-braintumor',
  templateUrl: './braintumor.component.html',
  styleUrls: ['./braintumor.component.css']
})
export class BraintumorComponent implements OnInit {
  previewImage: string | ArrayBuffer | null = null;
  predictionClass: string | null = null;
  accuracy = 0;
  isScanning = false;
  accuracyOffset = 251.2;
  selectedFile: File | null = null;

  index = 0;
  resultB = 0;
  text = '';
  braindiseases = ['glioma', 'meningioma', 'notumor', 'pituitary'];

  textList: string[] = [];
  displayedText: string[] = [];
  currentIndex = 0;

  showResult = false;
  date = new Date();
  imageFile!: File;

  constructor(
    private authService: AuthServiceService,
    private imageVerifService: ImageVerifService,
    private diagnosis: DiagnosisService,
    private diagnosismanagement: DiagnosisManagementService
  ) {}

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
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  verifyImages(): void {
    if (!this.selectedFile) return;

    this.imageVerifService.VerifImageBrainIrm(this.selectedFile).subscribe(
      response => {
        this.predictionClass = response.message;
        if (response.SSIM_score < 0.5) {
          alert('Please provide an image that represents a brain tumor for a better experience.');
        }
      },
      error => {
        console.error('Image Verification Error:', error);
        alert('An error occurred during verification.');
      }
    );
  }

  brainDiagnosis(): void {
    if (!this.selectedFile) return;

    this.diagnosis.braindiagnosis(this.selectedFile).subscribe(
      response => {
        if (typeof response.class === 'number' && response.class >= 0 && response.class < this.braindiseases.length) {
          this.resultB = response.class;
          this.index = this.resultB;
          this.text = this.braindiseases[this.index];

          this.setDiseaseDescription(); // Set detailed text based on result
          this.displayedText = Array(this.textList.length).fill('');
          this.startTypingEffect();

        } else {
          alert('Unexpected response from the server.');
        }
      },
      error => {
        console.error('Diagnosis Error:', error);
        alert('An error occurred while processing the diagnosis.');
      }
    );
  }

  startAnalysis() {
    if (!this.selectedFile) {
      alert('Please upload an image first.');
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
        this.brainDiagnosis();
        this.showResult = true;
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

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.displayedText[index] += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => this.typeText(index + 1), 1000);
      }
    }, 50);
  }

  setDiseaseDescription(): void {
    switch (this.text) {
      case 'glioma':
        this.textList = [
          'Gliomas are tumors originating from glial cells in the brain or spine.',
          'They often cause headaches, nausea, and seizures.',
          'Treatment may include surgery, radiation, and chemotherapy.'
        ];
        break;
      case 'meningioma':
        this.textList = [
          'Meningiomas grow from the meninges, the protective layers around the brain.',
          'They are usually benign but can cause pressure symptoms.',
          'Surgical removal is often effective if the tumor is accessible.'
        ];
        break;
      case 'notumor':
        this.textList = [
          'No signs of a tumor were detected in the image.',
          'However, this does not rule out all conditions.',
          'Further evaluation may be required if symptoms persist.'
        ];
        break;
      case 'pituitary':
        this.textList = [
          'Pituitary tumors affect the small gland at the base of the brain.',
          'They may disrupt hormone production and cause vision problems.',
          'Most are treatable through surgery or medication.'
        ];
        break;
      default:
        this.textList = ['Diagnosis result is unclear or not recognized.'];
    }
  }

  saveDiagnosis(): void {
    if (!this.selectedFile || !this.predictionClass || !this.text) {
      alert('Please complete the analysis before saving.');
      return;
    }

    const email = this.authService.getUserId();
    if (!email) {
      alert('User email not found.');
      return;
    }

    if (!this.selectedFile.type.startsWith('image/')) {
      alert('Invalid file type. Please select an image.');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (this.selectedFile.size > maxSizeInBytes) {
      alert('Image is too large. Max size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('diagnosis_Date', new Date().toISOString().split('T')[0]);
    formData.append('disease_name', this.text);
    formData.append('diagnostic_details', this.textList.join(', '));
    formData.append('image', this.selectedFile);
    formData.append('email', email);

    this.diagnosismanagement.addDiagnosis(formData).subscribe({
      next: () => alert('Diagnosis saved successfully!'),
      error: err => {
        console.error('Save Error:', err);
        alert('Failed to save diagnosis.');
      }
    });
  }
}
