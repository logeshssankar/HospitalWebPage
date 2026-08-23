import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';



interface Service {
  number: string;
  title: string;
  description: string;
  icon: string;
  iconBackground: string;
  featured: boolean;
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  services: Service[] = [

    {
      number: '01',
      title: 'Emergency Care',
      description:
        'Immediate medical attention with dedicated emergency specialists available around the clock.',
      icon: 'fa-solid fa-truck-medical',
      iconBackground: '#e9f7f8',
      featured: true
    },

    {
      number: '02',
      title: 'Cardiology',
      description:
        'Comprehensive heart care from diagnosis and prevention to advanced cardiac treatment.',
      icon: 'fa-solid fa-heart-pulse',
      iconBackground: '#eef8f3',
      featured: false
    },

    {
      number: '03',
      title: 'Neurology',
      description:
        'Specialized diagnosis and treatment for conditions affecting the brain and nervous system.',
      icon: 'fa-solid fa-brain',
      iconBackground: '#f1effb',
      featured: false
    },

    {
      number: '04',
      title: 'Pediatrics',
      description:
        'Gentle and specialized healthcare services designed specifically for children and infants.',
      icon: 'fa-solid fa-baby',
      iconBackground: '#fff5e8',
      featured: false
    },

    {
      number: '05',
      title: 'Dental Care',
      description:
        'Complete dental services focused on prevention, treatment, and maintaining healthy smiles.',
      icon: 'fa-solid fa-tooth',
      iconBackground: '#edf7fb',
      featured: false
    },

    {
      number: '06',
      title: 'Laboratory',
      description:
        'Reliable diagnostic testing with modern equipment and accurate results for better treatment.',
      icon: 'fa-solid fa-flask-vial',
      iconBackground: '#f3f7e9',
      featured: false
    }

  ];


  selectService(serviceName: string): void {

    console.log(`Selected service: ${serviceName}`);

    this.scrollToAppointment();

  }


  scrollToAppointment(): void {

    const section =
      document.getElementById('appointment');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }
}
