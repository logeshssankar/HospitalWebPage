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

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials implements OnDestroy {
  @ViewChild('testimonialsSection') sectionRef!: ElementRef<HTMLElement>;

  private cdr = inject(ChangeDetectorRef);
  private observer?: IntersectionObserver;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private readonly AUTOPLAY_DELAY = 3000;

  testimonialsVisible = false;
  isTransitioning = true;

  testimonials: Testimonial[] = [
    {
      name: 'Priya Srinivasan',
      role: 'Cardiology Patient',
      image: 'assets/images/Priya Srinivasan.webp',
      rating: 5,
      review:
        'The doctors and staff were extremely caring and professional. From the consultation to the treatment, everything was handled with great attention and compassion.',
    },
    {
      name: 'Arun Kumar',
      role: 'Orthopedic Patient',
      image: 'assets/images/Arun Kumar.jpg',
      rating: 5,
      review:
        'I had a wonderful experience at MediCare. The doctors explained everything clearly and the entire team made me feel comfortable throughout my treatment.',
    },
    {
      name: 'Divya Raj',
      role: 'Pediatric Patient',
      image: 'assets/images/Divya Raj.jpg',
      rating: 5,
      review:
        'The pediatric team was amazing with my child. They were patient, friendly and genuinely caring. I would definitely recommend MediCare to other parents.',
    },
    {
      name: 'Karthik R',
      role: 'General Medicine Patient',
      image: 'assets/images/Karthik R.jpg',
      rating: 5,
      review:
        'Booking an appointment was easy and the consultation was excellent. The hospital is clean, organized and the medical staff are very professional.',
    },
  ];

  currentIndex = 0;

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.testimonialsVisible = true;
            this.observer?.disconnect();
            this.startAutoplay();
            this.cdr.markForCheck();
          }
        },
        { threshold: 0.2 },
      );

      this.observer.observe(this.sectionRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stopAutoplay();
  }

  get currentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex];
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextTestimonial();
    }, this.AUTOPLAY_DELAY);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  private retriggerTransition(): void {
    this.isTransitioning = false;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.isTransitioning = true;
      this.cdr.markForCheck();
    }, 0);
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.retriggerTransition();
  }

  previousTestimonial(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.retriggerTransition();
    this.resumeAutoplay();
  }

  selectTestimonial(index: number): void {
    this.currentIndex = index;
    this.retriggerTransition();
    this.resumeAutoplay();
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
