import { Component, OnInit } from '@angular/core';

interface Doctor {
  name: string;
  specialty: string;
  country: string;
  photo: string;
  rating?: number;
}

interface Appointment {
  doctor?: Doctor;
  date?: string;
}

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  // Filters
  specialties: string[] = ['Cardiology', 'Neurology', 'Pulmonology', 'Ophthalmology'];
  countries: string[] = ['Tunisie', 'France', 'Allemagne', 'Maroc'];

  selectedCountry: string = '';
  selectedSpecialty: string = '';

  // Doctors
  doctors: Doctor[] = [
    { name: 'Dr. A', specialty: 'Cardiology', country: 'Tunisie', photo: 'assets/images/docfemale.jpg', rating: 4.5 },
    { name: 'Dr. B', specialty: 'Neurology', country: 'France', photo: 'assets/images/docold.jpg', rating: 4.7 },
    { name: 'Dr. C', specialty: 'Pulmonology', country: 'Allemagne', photo: 'assets/images/docfemale.jpg', rating: 4.2 },
    { name: 'Dr. D', specialty: 'Ophthalmology', country: 'Maroc', photo: 'assets/images/docold.jpg', rating: 4.8 },
    { name: 'Dr. E', specialty: 'Ophthalmology', country: 'Maroc', photo: 'assets/images/docfemale.jpg', rating: 4.8 },
  ];

  filteredDoctors: Doctor[] = [];

  // Selected doctor & appointment
  selectedDoctor: Doctor | null = null;
  newAppointment: Appointment = {};

  ngOnInit(): void {
    // Show all doctors initially
    this.filteredDoctors = this.doctors;
  }

  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter(d =>
      (this.selectedCountry === '' || d.country === this.selectedCountry) &&
      (this.selectedSpecialty === '' || d.specialty === this.selectedSpecialty)
    );
  }

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.newAppointment = { doctor: doctor };
  }

  bookAppointment(): void {
    if (this.selectedDoctor && this.newAppointment.date) {
      alert(`Rendez-vous réservé avec ${this.selectedDoctor.name} le ${this.newAppointment.date}`);
      // Reset selection
      this.selectedDoctor = null;
      this.newAppointment = {};
    } else {
      alert('Veuillez sélectionner un docteur et une date');
    }
  }

  resetFilters(): void {
    this.selectedCountry = '';
    this.selectedSpecialty = '';
    this.filteredDoctors = this.doctors;
  }

}
