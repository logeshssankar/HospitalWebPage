import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  constructor(private departmentService: DepartmentService) {}

  quickLinks = [
    {
      name: 'Home',
      id: 'home',
    },
    {
      name: 'About Us',
      id: 'about',
    },
    {
      name: 'Services',
      id: 'services',
    },
    {
      name: 'Doctors',
      id: 'doctors',
    },
    {
      name: 'Appointment',
      id: 'appointment',
    },
    {
      name: 'Contact',
      id: 'contact',
    },
  ];

  departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'General Medicine',
  ];

  selectDepartment(event: Event, department: string): void {
    event.preventDefault();

    this.departmentService.selectDepartment(department);

    const element = document.getElementById('departments');

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
