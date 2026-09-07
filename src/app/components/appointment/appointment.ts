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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment implements OnDestroy {
  @ViewChild('appointmentSection') sectionRef!: ElementRef<HTMLElement>;

  private cdr = inject(ChangeDetectorRef);
  private observer?: IntersectionObserver;

  appointmentVisible = false;

  appointmentForm: FormGroup;

  submitted = false;

  isSuccess = false;

  departments = [
    'Cardiology',

    'Neurology',

    'Orthopedics',

    'Pediatrics',

    'Gynecology',

    'General Medicine',
  ];

  doctors = ['Dr. Arjun Kumar', 'Dr. Priya Sharma', 'Dr. Rahul Menon', 'Dr. Ananya Rao'];

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],

      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

      email: ['', [Validators.required, Validators.email]],

      department: ['', Validators.required],

      doctor: ['', Validators.required],

      date: ['', Validators.required],

      message: [''],
    });

    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.appointmentVisible = true;
            this.observer?.disconnect();
            this.cdr.markForCheck();
          }
        },
        { threshold: 0.15 },
      );

      this.observer.observe(this.sectionRef.nativeElement);
    });
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  get f() {
    return this.appointmentForm.controls;
  }

  submitAppointment(): void {
    this.submitted = true;

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();

      return;
    }

    console.log('Appointment Data:', this.appointmentForm.value);

    this.isSuccess = true;

    this.appointmentForm.reset();

    this.submitted = false;
  }

  closeSuccess(): void {
    this.isSuccess = false;
  }
}
