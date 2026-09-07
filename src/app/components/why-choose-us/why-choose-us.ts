import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';

interface Statistic {
  value: number;
  displayValue: number;
  suffix: string;
  label: string;
  icon: string;
}

interface Feature {
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-why-choose-us',
  imports: [CommonModule],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.css',
})
export class WhyChooseUs implements OnDestroy {
  @ViewChild('whyChooseSection') sectionRef!: ElementRef<HTMLElement>;

  private cdr = inject(ChangeDetectorRef);

  whyVisible = false;
  private observer?: IntersectionObserver;
  private countUpStarted = false;

  features: Feature[] = [
    {
      title: 'Experienced Medical Team',
      desc: 'Skilled specialists committed to delivering exceptional patient care.',
      icon: 'fa-solid fa-user-doctor',
    },
    {
      title: 'Advanced Technology',
      desc: 'Modern diagnostic and treatment technology for accurate healthcare.',
      icon: 'fa-solid fa-microscope',
    },
    {
      title: 'Patient-First Approach',
      desc: 'Every decision is made with your comfort, safety and wellbeing in mind.',
      icon: 'fa-solid fa-heart',
    },
  ];

  statistics: Statistic[] = [
    {
      value: 25,
      displayValue: 0,
      suffix: '+',
      label: 'Years of Experience',
      icon: 'fa-solid fa-calendar-check',
    },
    {
      value: 50,
      displayValue: 0,
      suffix: '+',
      label: 'Specialist Doctors',
      icon: 'fa-solid fa-user-doctor',
    },
    {
      value: 10,
      displayValue: 0,
      suffix: 'K+',
      label: 'Happy Patients',
      icon: 'fa-solid fa-users',
    },
    {
      value: 24,
      displayValue: 0,
      suffix: '/7',
      label: 'Emergency Support',
      icon: 'fa-solid fa-truck-medical',
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.whyVisible = true;
            this.startCountUp();
            this.observer?.disconnect();
            this.cdr.markForCheck();
          }
        },
        { threshold: 0.25 },
      );

      this.observer.observe(this.sectionRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private startCountUp(): void {
    if (this.countUpStarted) return;
    this.countUpStarted = true;

    this.statistics.forEach((stat, i) => {
      const delay = 650 + i * 120;
      setTimeout(() => this.animateNumber(stat), delay);
    });
  }

  private animateNumber(stat: Statistic): void {
    const duration = 900;
    const start = performance.now();
    const from = 0;
    const to = stat.value;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.displayValue = Math.round(from + (to - from) * eased);

      this.cdr.markForCheck();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        stat.displayValue = to;
        this.cdr.markForCheck();
      }
    };

    requestAnimationFrame(step);
  }

  scrollToAppointment(): void {
    document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
  }
}
