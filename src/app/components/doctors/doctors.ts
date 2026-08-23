import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Doctor {

  name: string;

  specialty: string;

  image: string;

  rating: number;

  experience: number;

  patients: number;

  available: boolean;

}

@Component({
  selector: 'app-doctors',
  imports: [CommonModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors {
doctors: Doctor[] = [

    {
      name: 'Dr. Arjun Kumar',
      specialty: 'Senior Cardiologist',
      image: 'assets/images/Doctor_4.jpg',
      rating: 4.9,
      experience: 15,
      patients: 3200,
      available: true
    },


    {
      name: 'Dr. Priya Sharma',
      specialty: 'Neurologist',
      image: 'assets/images/Doctor_2.jpg',
      rating: 4.8,
      experience: 12,
      patients: 2800,
      available: true
    },


    {
      name: 'Dr. Rahul Menon',
      specialty: 'Pediatrician',
      image: 'assets/images/Doctor_3.jpg',
      rating: 4.9,
      experience: 10,
      patients: 2400,
      available: true
    },


    {
      name: 'Dr. Ananya Rao',
      specialty: 'Orthopedic Surgeon',
      image: 'assets/images/Doctor_1.jpg',
      rating: 4.8,
      experience: 14,
      patients: 2900,
      available: false
    }

  ];


  bookAppointment(doctor: Doctor): void {

    if (!doctor.available) {
      return;
    }

    console.log(
      `Appointment requested with ${doctor.name}`
    );

    const section =
      document.getElementById('appointment');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }


  viewAllDoctors(): void {

    console.log('View all doctors');

  }
}
