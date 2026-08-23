import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


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
export class Testimonials {

  testimonials: Testimonial[] = [

    {

      name: 'Priya Srinivasan',

      role: 'Cardiology Patient',

      image: 'assets/images/Priya Srinivasan.webp',

      rating: 5,

      review:
        'The doctors and staff were extremely caring and professional. From the consultation to the treatment, everything was handled with great attention and compassion.'

    },


    {

      name: 'Arun Kumar',

      role: 'Orthopedic Patient',

      image: 'assets/images/Arun Kumar.jpg',

      rating: 5,

      review:
        'I had a wonderful experience at MediCare. The doctors explained everything clearly and the entire team made me feel comfortable throughout my treatment.'

    },


    {

      name: 'Divya Raj',

      role: 'Pediatric Patient',

      image: 'assets/images/patient-3.jpg',

      rating: 5,

      review:
        'The pediatric team was amazing with my child. They were patient, friendly and genuinely caring. I would definitely recommend MediCare to other parents.'

    },


    {

      name: 'Karthik R',

      role: 'General Medicine Patient',

      image: 'assets/images/patient-4.jpg',

      rating: 5,

      review:
        'Booking an appointment was easy and the consultation was excellent. The hospital is clean, organized and the medical staff are very professional.'

    }

  ];


  currentIndex = 0;


  get currentTestimonial(): Testimonial {

    return this.testimonials[this.currentIndex];

  }


  nextTestimonial(): void {

    this.currentIndex =
      (this.currentIndex + 1)
      % this.testimonials.length;

  }


  previousTestimonial(): void {

    this.currentIndex =
      (this.currentIndex - 1 +
       this.testimonials.length)
      % this.testimonials.length;

  }


  selectTestimonial(index: number): void {

    this.currentIndex = index;

  }


  getStars(rating: number): number[] {

    return Array(rating).fill(0);

  }

}
