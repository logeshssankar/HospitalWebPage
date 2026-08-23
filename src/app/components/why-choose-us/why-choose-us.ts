import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Statistic {

  value: number;

  suffix: string;

  label: string;

  icon: string;

}


@Component({
  selector: 'app-why-choose-us',
  imports: [CommonModule],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.css',
})
export class WhyChooseUs {
statistics: Statistic[] = [

    {
      value: 25,
      suffix: '+',
      label: 'Years of Experience',
      icon: 'fa-solid fa-calendar-check'
    },

    {
      value: 50,
      suffix: '+',
      label: 'Specialist Doctors',
      icon: 'fa-solid fa-user-doctor'
    },

    {
      value: 10,
      suffix: 'K+',
      label: 'Happy Patients',
      icon: 'fa-solid fa-users'
    },

    {
      value: 24,
      suffix: '/7',
      label: 'Emergency Support',
      icon: 'fa-solid fa-truck-medical'
    }

  ];


  scrollToAppointment(): void {

    const section =
      document.getElementById('appointment');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }

}
