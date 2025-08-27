import { Component } from '@angular/core';

@Component({
  selector: 'app-appointements',
  templateUrl: './appointements.component.html',
  styleUrls: ['./appointements.component.css']
})
export class AppointementsComponent {
  appointments = [
    { doctor: 'Dr. Smith', specialty: 'Cardiology', date: new Date('2025-08-20 10:30'), status: 'Upcoming' },
    { doctor: 'Dr. Jane', specialty: 'Neurology', date: new Date('2025-08-15 14:00'), status: 'Pending' },
    { doctor: 'Dr. Alex', specialty: 'Pulmonology', date: new Date('2025-08-10 09:00'), status: 'Completed' }
  ];
}
