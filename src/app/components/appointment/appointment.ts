import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AppointmentService } from '../service/appointment';

import {
  AppointmentSelectionService,
  SelectedDoctor
} from '../service/appointment-selection.service';

import { Subscription } from 'rxjs';

import {
  Doctor,
  DoctorService
} from '../service/doctor.service';


@Component({
  selector: 'app-appointment',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './appointment.html',

  styleUrl: './appointment.css',
})
export class Appointment implements OnDestroy {


  // =========================================================
  // APPOINTMENT SECTION
  // =========================================================

  @ViewChild('appointmentSection')
  sectionRef!: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;

  private fallbackTimer?: ReturnType<typeof setTimeout>;

  appointmentVisible = signal(false);


  // =========================================================
  // APPOINTMENT MODAL
  // =========================================================

  isModalOpen = false;


  // =========================================================
  // FORM
  // =========================================================

  appointmentForm: FormGroup;

  submitted = false;

  isSuccess = false;

  isSubmitting = false;

  errorMessage = '';


  // =========================================================
  // DOCTOR SELECTION
  // =========================================================

  private doctorSelectionSubscription?: Subscription;

  selectedDoctorId: number | null = null;

  isDoctorLocked = false;

  isDepartmentLocked = false;


  // =========================================================
  // DEPARTMENTS — fetched from backend (no hardcoding)
  // =========================================================

  departments: string[] = [];


  // =========================================================
  // DOCTORS — all from backend
  // =========================================================

  allDoctors: Doctor[] = [];


  // =========================================================
  // AVAILABLE DOCTORS — only available ones for dropdown
  // =========================================================

  get availableDoctors(): Doctor[] {
    return this.allDoctors.filter(d => d.available);
  }


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private fb: FormBuilder,

    private appointmentService: AppointmentService,

    private doctorService: DoctorService,

    private appointmentSelectionService:
      AppointmentSelectionService

  ) {


    // =======================================================
    // CREATE APPOINTMENT FORM
    // =======================================================

    this.appointmentForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      age: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(120)
        ]
      ],

      sex: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      department: [
        '',
        Validators.required
      ],

      doctor: [
        '',
        Validators.required
      ],

      date: [
        '',
        Validators.required
      ],

      time: [
        '',
        Validators.required
      ],

      message: ['']

    });


    // =======================================================
    // LOAD DOCTORS + DEPARTMENTS FROM BACKEND
    // =======================================================

    this.loadDoctors();


    // =======================================================
    // APPOINTMENT SECTION REVEAL
    // =======================================================

    afterNextRender(() => {

      requestAnimationFrame(() => {
        this.setupObserver();
      });

      this.fallbackTimer = setTimeout(() => {
        if (!this.appointmentVisible()) {
          this.appointmentVisible.set(true);
        }
      }, 2000);

    });


    // =======================================================
    // DOCTOR SELECTION (from Doctors component)
    // =======================================================

    this.doctorSelectionSubscription =

      this.appointmentSelectionService.selectedDoctor$

        .subscribe(
          (doctor: SelectedDoctor | null) => {

            if (!doctor) return;

            this.selectedDoctorId = doctor.id;

            this.isDoctorLocked = true;
            this.isDepartmentLocked = true;

            this.appointmentForm.patchValue({
              doctor: doctor.name,
              department: doctor.department
            });

            this.appointmentForm.get('doctor')?.disable();
            this.appointmentForm.get('department')?.disable();

            this.openAppointmentModal();

          }
        );

  }


  // =========================================================
  // APPOINTMENT SECTION OBSERVER
  // =========================================================

  private setupObserver(): void {

    if (!this.sectionRef?.nativeElement) return;

    const rect =
      this.sectionRef.nativeElement.getBoundingClientRect();

    const alreadyVisible =
      rect.top < window.innerHeight * 0.85 &&
      rect.bottom > 0;

    if (alreadyVisible) {
      this.appointmentVisible.set(true);
      this.clearFallback();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.appointmentVisible.set(true);
          this.clearFallback();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.sectionRef.nativeElement);
  }


  // =========================================================
  // CLEAR FALLBACK TIMER
  // =========================================================

  private clearFallback(): void {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = undefined;
    }
  }


  // =========================================================
  // OPEN APPOINTMENT MODAL
  // =========================================================

  openAppointmentModal(): void {
    this.isModalOpen = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }


  // =========================================================
  // CLOSE APPOINTMENT MODAL
  // =========================================================

  closeAppointmentModal(): void {
    this.isModalOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }


  // =========================================================
  // BACKDROP CLICK
  // =========================================================

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeAppointmentModal();
    }
  }


  // =========================================================
  // ESC KEY
  // =========================================================

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeAppointmentModal();
    }
  }


  // =========================================================
  // FORM CONTROLS
  // =========================================================

  get f() {
    return this.appointmentForm.controls;
  }


  // =========================================================
  // SUBMIT APPOINTMENT
  // =========================================================

  submitAppointment(): void {

    this.submitted = true;
    this.errorMessage = '';

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const formValue = this.appointmentForm.getRawValue();

    const appointmentData = {
      patientName: formValue.name,
      age: formValue.age,
      sex: formValue.sex,
      email: formValue.email,
      phone: formValue.phone,
      department: formValue.department,
      doctor: formValue.doctor,
      appointmentDate: formValue.date,
      appointmentTime: formValue.time,
      message: formValue.message
    };

    console.log('Sending appointment to backend:', appointmentData);

    this.appointmentService
      .createAppointment(appointmentData)
      .subscribe({

        next: (response) => {

          console.log('Appointment saved successfully:', response);

          this.isSubmitting = false;
          this.isSuccess = true;

          this.appointmentForm.reset();
          this.appointmentForm.get('doctor')?.enable();
          this.appointmentForm.get('department')?.enable();

          this.isDoctorLocked = false;
          this.isDepartmentLocked = false;
          this.selectedDoctorId = null;
          this.submitted = false;

          this.appointmentSelectionService.clearSelection();
          this.closeAppointmentModal();

        },

        error: (error) => {

          console.error('Appointment API Error:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Unable to book your appointment. Please try again.';

        }

      });

  }


  // =========================================================
  // LOAD DOCTORS + BUILD DEPARTMENTS FROM BACKEND
  // =========================================================

  private loadDoctors(): void {

    this.doctorService
      .getAllDoctors()
      .subscribe({

        next: (data) => {

          console.log('Doctors loaded for appointment:', data);

          this.allDoctors = data;

          // Build unique departments list from backend — NO hardcoding
          const deptSet = new Set<string>();
          data.forEach(doc => {
            if (doc.department && doc.department.trim()) {
              deptSet.add(doc.department.trim());
            }
          });
          this.departments = Array.from(deptSet).sort();

        },

        error: (error) => {
          console.error('Failed to load doctors:', error);
        }

      });

  }


  // =========================================================
  // CLOSE SUCCESS MESSAGE
  // =========================================================

  closeSuccess(): void {
    this.isSuccess = false;
  }


  // =========================================================
  // COMPONENT DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.doctorSelectionSubscription?.unsubscribe();

    this.clearFallback();

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }

  }

}
