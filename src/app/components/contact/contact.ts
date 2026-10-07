import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ContactService
} from '../service/contact.service';


@Component({
  selector: 'app-contact',

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './contact.html',

  styleUrl: './contact.css',
})
export class Contact implements OnDestroy {


  // =====================================================
  // CONTACT SECTION
  // =====================================================

  @ViewChild('contactSection')
  sectionRef!: ElementRef<HTMLElement>;


  private cdr = inject(ChangeDetectorRef);

  private observer?: IntersectionObserver;


  contactVisible = false;


  // =====================================================
  // CONTACT FORM
  // =====================================================

  contactForm: FormGroup;


  submitted = false;


  // =====================================================
  // SUBMISSION STATES
  // =====================================================

  messageSent = false;

  isSubmitting = false;

  errorMessage = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private fb: FormBuilder,

    private contactService: ContactService

  ) {


    // ===================================================
    // CREATE FORM
    // ===================================================

    this.contactForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],


      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],


      phone: [
        '',
        [
          Validators.pattern(
            /^[6-9]\d{9}$/
          )
        ]
      ],


      subject: [
        '',
        Validators.required
      ],


      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]

    });


    // ===================================================
    // SECTION REVEAL
    // ===================================================

    afterNextRender(() => {


      this.observer =
        new IntersectionObserver(

          ([entry]) => {


            if (entry.isIntersecting) {


              this.contactVisible = true;


              this.observer?.disconnect();


              this.cdr.markForCheck();

            }

          },

          {
            threshold: 0.15
          }

        );


      if (this.sectionRef?.nativeElement) {

        this.observer.observe(
          this.sectionRef.nativeElement
        );

      }

    });

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.setBodyScroll(false);  

  }


  // =====================================================
  // FORM CONTROLS
  // =====================================================

  get f() {

    return this.contactForm.controls;

  }


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  sendMessage(): void {


    // ---------------------------------------------------
    // MARK FORM AS SUBMITTED
    // ---------------------------------------------------

    this.submitted = true;


    // ---------------------------------------------------
    // CLEAR PREVIOUS ERROR
    // ---------------------------------------------------

    this.errorMessage = '';


    // ---------------------------------------------------
    // VALIDATE FORM
    // ---------------------------------------------------

    if (this.contactForm.invalid) {


      this.contactForm.markAllAsTouched();


      return;

    }


    // ---------------------------------------------------
    // PREVENT DUPLICATE REQUEST
    // ---------------------------------------------------

    if (this.isSubmitting) {

      return;

    }


    this.isSubmitting = true;


    // ---------------------------------------------------
    // GET FORM VALUE
    // ---------------------------------------------------

    const formValue =
      this.contactForm.getRawValue();


    // ---------------------------------------------------
    // CREATE REQUEST OBJECT
    // ---------------------------------------------------

    const contactData = {

      name: formValue.name,

      email: formValue.email,

      phone: formValue.phone || '',

      subject: formValue.subject,

      message: formValue.message

    };


    console.log(
      'Sending contact message:',
      contactData
    );


    // ===================================================
    // CALL SPRING BOOT BACKEND
    // ===================================================

    this.contactService

      .sendMessage(contactData)

      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response) => {


          console.log(
            'Contact message sent successfully:',
            response
          );


          this.isSubmitting = false;


          this.messageSent = true;


          // ------------------------------------------------
          // RESET FORM
          // ------------------------------------------------

          this.contactForm.reset();


          this.submitted = false;


          this.cdr.markForCheck();

          this.setBodyScroll(true);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {


          console.error(
            'Contact message API Error:',
            error
          );


          this.isSubmitting = false;


          this.errorMessage =
            'Unable to send your message. Please try again.';


          this.cdr.markForCheck();

        }

      });

  }

  private setBodyScroll(disabled: boolean): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.style.overflow = disabled ? 'hidden' : '';
}


  // =====================================================
  // CLOSE SUCCESS MESSAGE
  // =====================================================

  closeMessage(): void {

    this.messageSent = false;

    this.setBodyScroll(false);

  }

}