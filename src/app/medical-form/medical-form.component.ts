
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthFormService } from '../services/healthform.service';

@Component({
  selector: 'app-medical-form',
  templateUrl: './medical-form.component.html',
  styleUrls: ['./medical-form.component.css']
})
export class MedicalFormComponent implements OnInit {
  practicesSport = false;
  hasSurgicalOperation = false;
  bmi: string = '';
  bmiCategory: string = '';
  isFemale = false;
  isAddicted = false;
  healthForm: any;
  isFormLoading = false;
  hasExistingRecord = false;
  formLoaded = false;

  constructor(
    private fb: FormBuilder,
    private healthFormService: HealthFormService
  ) {
  }
    
  patchHealthForm(data: any) {
    this.healthForm.patchValue({
      height: data.height,
      weight: data.weight,
      chronicDiseases: data.chronic_diseases ? 'yes' : 'no',
      addiction: data.addiction ? 'yes' : 'no',
      addictionDetails: data.addiction_details || '',
      familyHistory: data.family_history || '',
      familyHistoryOsteoporosis: data.family_history_osteoporosis || '',
      menopauseAge: data.menopause_age,
      surgicalOperations: data.surgical_operations ? 'yes' : 'no',
      operationDetails: data.operation_details || '',
      sportPractice: data.sport_practice ? 'yes' : 'no',
      sportDetails: data.sport_details || '',
      historyOfFracture: data.history_of_fracture,
      hypothyroidism: data.hypothyroidism ? 'yes' : 'no',
      bloodType: data.blood_type || '',
      diet: data.diet || '',
      allergies: data.allergies || '',
      smoking: data.smoking ? 'yes' : 'no',
      alcohol: data.alcohol ? 'yes' : 'no',
      hospitalVisits: data.hospital_visits,
      stress: data.stress,
      sleep: data.sleep,
      medications: data.medications || '',
      bmi: data.bmi || '',
      gender: data.gender || 'male'  // Optional default
    });
  
    // Optionally trigger UI flags
    this.hasSurgicalOperation = data.surgical_operations;
    this.practicesSport = data.sport_practice;
    this.isAddicted = data.addiction;
  }
  ngOnInit(): void {
    // Initialize the form here

  
    if (!this.formLoaded) {
      this.formLoaded = true;
      this.healthForm = this.fb.group({
        height: [null, [Validators.required, Validators.min(1)]],
        weight: [null, [Validators.required, Validators.min(1)]],
        gender: ['male', Validators.required],
        chronicDiseases: ['no', Validators.required],
        addiction: ['no', Validators.required],
        addictionDetails: [''],
        familyHistory: [''],
        familyHistoryOsteoporosis: [''],
        menopauseAge: [null],
        surgicalOperations: ['no'],
        sportPractice: ['no'],
        sportDetails: [''],
        historyOfFracture: [null],
        hypothyroidism: ['no'], // updated to string to match select
        bloodType: [''],
        diet: [''],
        allergies: [''],
        smoking: ['no'], // updated to string
        alcohol: ['no'], // updated to string
        hospitalVisits: [0],
        operationDetails: [''],
        stress: [0],
        bmi: [''],
        sleep: [null],
        medications: ['']
      });
      this.getHealthForm();
    }
  
    // Rest of your code for value changes
    this.healthForm.get('height')?.valueChanges.subscribe(() => this.calculateBMI());
    this.healthForm.get('weight')?.valueChanges.subscribe(() => this.calculateBMI());
    this.healthForm.get('gender')?.valueChanges.subscribe((gender: string) => {
      this.isFemale = gender === 'female';
    });
  
    this.healthForm.get('addiction')?.valueChanges.subscribe((value: string) => {
      this.isAddicted = value === 'yes';
    });
  }
  
 
 
  getHealthForm(): void {
    this.isFormLoading = true;
    this.healthFormService.getHealthForms().subscribe({
      next: (response) => {
        if (response) {
          this.healthForm.patchValue(response);
          this.hasExistingRecord = true;
          this.calculateBMI();

          this.practicesSport = this.healthForm.get('sportPractice')?.value === 'yes';
          this.hasSurgicalOperation = this.healthForm.get('surgicalOperations')?.value === 'yes';
          this.isAddicted = this.healthForm.get('addiction')?.value === 'yes';
          this.isFemale = this.healthForm.get('gender')?.value === 'female'; this.patchHealthForm(response[0]);  
          console.log(response)
        } else {
          this.hasExistingRecord = false;
        }
        this.isFormLoading = false;
      },
      error: (err) => {
        console.error('Error fetching form:', err);
        this.isFormLoading = false;
      }
    });
  }

  onSurgicalOperationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.hasSurgicalOperation = value === 'yes';
  }

  onSportPracticeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.practicesSport = value === 'yes';
  }

  onAddictionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.isAddicted = value === 'yes';
  }

  calculateBMI(): void {
    const height = this.healthForm.get('height')?.value;
    const weight = this.healthForm.get('weight')?.value;

    if (height && weight) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      this.bmi = bmi.toFixed(2);
      this.bmiCategory = this.getBMICategory(bmi);
      this.healthForm.get('bmi')?.setValue(this.bmi);
    }
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
  }

  onSubmit(): void {
    if (this.healthForm.valid) {
      this.isFormLoading = true;
      this.healthFormService.createHealthForm(this.healthForm.value).subscribe({
        next: (response) => {
          this.isFormLoading = false;
          this.hasExistingRecord = true;
          console.log('Form submitted successfully:', response);
        },
        error: (err) => {
          this.isFormLoading = false;
          console.error('Form submission error:', err);
        }
      });
    }
  }

  onUpdate(): void {
    if (this.healthForm.valid) {
      this.isFormLoading = true;
      this.healthFormService.updateHealthForm(this.healthForm.value).subscribe({
        next: (response) => {
          this.isFormLoading = false;
          this.hasExistingRecord = true;
          console.log('Form updated successfully:', response);
        },
        error: (err) => {
          this.isFormLoading = false;
          console.error('Error updating form:', err);
        }
      });
    }
  }

  deleteHealthForm(): void {
    if (confirm('Are you sure you want to delete this health form?')) {
      this.isFormLoading = true;
      this.healthFormService.deleteHealthForm().subscribe({
        next: (response) => {
          this.isFormLoading = false;
          this.close();
          console.log('Form deleted:', response);
        },
        error: (err) => {
          this.isFormLoading = false;
          console.error('Error deleting form:', err);
        }
      });
    }
  }

  close(): void {
    this.healthForm.reset();
    this.hasExistingRecord = false;
    this.practicesSport = false;
    this.hasSurgicalOperation = false;
    this.isAddicted = false;
    this.isFemale = false;
    this.bmi = '';
    this.bmiCategory = '';
  }
}
