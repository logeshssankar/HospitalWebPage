import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
 currentYear = new Date().getFullYear();


  quickLinks = [
    {
      name: 'Home',
      id: 'home'
    },
    {
      name: 'About Us',
      id: 'about'
    },
    {
      name: 'Services',
      id: 'services'
    },
    {
      name: 'Doctors',
      id: 'doctors'
    },
    {
      name: 'Appointment',
      id: 'appointment'
    },
    {
      name: 'Contact',
      id: 'contact'
    }
  ];


  departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'General Medicine'
  ];


  scrollTo(id: string): void {

    const element =
      document.getElementById(id);

    if (element) {

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }

  }
}
