import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

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
export class Doctors implements AfterViewInit, OnDestroy {
  @ViewChild('doctorsSection')
  doctorsSection?: ElementRef<HTMLElement>;

  @ViewChildren('doctorCard')
  doctorCards!: QueryList<ElementRef<HTMLElement>>;

  private scrollListener?: () => void;

  private ticking = false;

  private readonly REVEAL_DISTANCE = 280;

  private readonly CARD_STAGGER = 0.1;

  private readonly ROW_STAGGER = 0.22;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    requestAnimationFrame(() => {
      this.setupDoctorReveal();
    });
  }

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {}

  doctors: Doctor[] = [
    {
      name: 'Dr. Arjun Kumar',
      specialty: 'Senior Cardiologist',
      image: 'assets/images/Doctor_4.jpg',
      rating: 4.9,
      experience: 15,
      patients: 3200,
      available: true,
    },

    {
      name: 'Dr. Priya Sharma',
      specialty: 'Neurologist',
      image: 'assets/images/Doctor_2.jpg',
      rating: 4.8,
      experience: 12,
      patients: 2800,
      available: true,
    },

    {
      name: 'Dr. Rahul Menon',
      specialty: 'Pediatrician',
      image: 'assets/images/Doctor_3.jpg',
      rating: 4.9,
      experience: 10,
      patients: 2400,
      available: true,
    },

    {
      name: 'Dr. Ananya Rao',
      specialty: 'Orthopedic Surgeon',
      image: 'assets/images/Doctor_1.jpg',
      rating: 4.8,
      experience: 14,
      patients: 2900,
      available: false,
    },
  ];

  bookAppointment(doctor: Doctor): void {
    if (!doctor.available) {
      return;
    }

    console.log(`Appointment requested with ${doctor.name}`);

    const section = document.getElementById('appointment');

    section?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  private remap(value: number, inMin: number, inMax: number): number {
    const t = (value - inMin) / (inMax - inMin);

    return Math.min(Math.max(t, 0), 1);
  }

  private applyDoctorReveal(card: HTMLElement, progress: number): void {
    const cardProgress = this.remap(progress, 0, 0.3);

    const imageProgress = this.remap(progress, 0.0, 0.55);

    const badgeProgress = this.remap(progress, 0.3, 0.6);

    const contentProgress = this.remap(progress, 0.42, 0.7);

    const socialProgress = this.remap(progress, 0.55, 0.78);

    const buttonProgress = this.remap(progress, 0.7, 1);

    card.style.setProperty('--card-progress', `${cardProgress}`);

    card.style.setProperty('--image-progress', `${imageProgress}`);

    card.style.setProperty('--badge-progress', `${badgeProgress}`);

    card.style.setProperty('--content-progress', `${contentProgress}`);

    card.style.setProperty('--social-progress', `${socialProgress}`);

    card.style.setProperty('--button-progress', `${buttonProgress}`);
  }

  private setupDoctorReveal(): void {
    const cards = this.doctorCards?.toArray() ?? [];

    if (!cards.length) {
      return;
    }

    this.scrollListener = () => {
      if (this.ticking) {
        return;
      }

      this.ticking = true;

      requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;

        let columns = 3;

        if (window.innerWidth <= 768) {
          columns = 1;
        } else if (window.innerWidth <= 1100) {
          columns = 2;
        }

        cards.forEach((ref, index) => {
          const card = ref.nativeElement;

          const rect = card.getBoundingClientRect();

          const row = Math.floor(index / columns);

          const column = index % columns;

          const columnDelay = column * this.CARD_STAGGER;

          const rowDelay = row * this.ROW_STAGGER;

          const totalDelay = columnDelay + rowDelay;

          const delayPixels = totalDelay * this.REVEAL_DISTANCE;

          const revealLine = viewportHeight * 0.95;

          const progress = this.remap(
            revealLine - rect.top - delayPixels,

            0,

            this.REVEAL_DISTANCE,
          );

          this.applyDoctorReveal(card, progress);
        });

        this.ticking = false;
      });
    };

    window.addEventListener('scroll', this.scrollListener, {
      passive: true,
    });

    window.addEventListener('resize', this.scrollListener, {
      passive: true,
    });

    this.scrollListener();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);

      window.removeEventListener('resize', this.scrollListener);
    }
  }

  viewAllDoctors(): void {
    console.log('View all doctors');
  }
}
