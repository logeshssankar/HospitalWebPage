import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';

interface Department {
  number: string;

  title: string;

  doctors: number;

  icon: string;

  description: string;

  features: string[];
}

@Component({
  selector: 'app-departments',
  imports: [CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.department$.subscribe((departmentName) => {
      const index = this.departments.findIndex((department) => department.title === departmentName);

      if (index !== -1) {
        this.selectDepartment(index);
      }
    });
  }

  selectedIndex = 0;
  animateIn = true;

  departments: Department[] = [
    {
      number: '01',

      title: 'Cardiology',

      doctors: 8,

      icon: 'fa-solid fa-heart-pulse',

      description:
        'Our cardiology department provides comprehensive heart care, from preventive screenings and diagnosis to advanced cardiac treatments.',

      features: [
        'Advanced cardiac diagnosis',

        'Heart disease prevention',

        'Cardiac rehabilitation',

        '24/7 cardiac emergency support',
      ],
    },

    {
      number: '02',

      title: 'Neurology',

      doctors: 6,

      icon: 'fa-solid fa-brain',

      description:
        'Our neurology specialists provide expert diagnosis and treatment for disorders affecting the brain, spine, and nervous system.',

      features: [
        'Neurological diagnosis',

        'Stroke management',

        'Headache treatment',

        'Neuro rehabilitation',
      ],
    },

    {
      number: '03',

      title: 'Orthopedics',

      doctors: 7,

      icon: 'fa-solid fa-bone',

      description:
        'Comprehensive orthopedic care for bones, joints, muscles, and mobility-related conditions using modern treatment methods.',

      features: [
        'Joint replacement',

        'Sports injury treatment',

        'Fracture management',

        'Physiotherapy support',
      ],
    },

    {
      number: '04',

      title: 'Pediatrics',

      doctors: 5,

      icon: 'fa-solid fa-baby',

      description:
        'Specialized healthcare for infants, children, and adolescents in a safe and friendly environment.',

      features: [
        'Child health checkups',

        'Vaccination services',

        'Growth monitoring',

        'Pediatric emergency care',
      ],
    },

    {
      number: '05',

      title: 'Gynecology',

      doctors: 6,

      icon: 'fa-solid fa-person-dress',

      description:
        'Comprehensive women’s healthcare covering routine checkups, reproductive health, pregnancy care, and specialized treatment.',

      features: [
        'Women wellness care',

        'Pregnancy support',

        'Reproductive healthcare',

        'Preventive screenings',
      ],
    },

    {
      number: '06',

      title: 'General Medicine',

      doctors: 9,

      icon: 'fa-solid fa-stethoscope',

      description:
        'Our general medicine team provides comprehensive primary healthcare, diagnosis, prevention, and long-term health management.',

      features: [
        'Routine health checkups',

        'Preventive healthcare',

        'Chronic disease management',

        'General medical consultation',
      ],
    },
  ];

  get selectedDepartment(): Department {
    return this.departments[this.selectedIndex];
  }

  selectDepartment(index: number): void {
    if (this.selectedIndex === index) return;

    this.animateIn = false;

    setTimeout(() => {
      this.selectedIndex = index;
      this.animateIn = true;
    }, 0);
  }

  viewDepartment(): void {
    const section = document.getElementById('doctors');

    section?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
