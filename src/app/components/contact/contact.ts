import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
contactForm: FormGroup;

  submitted = false;

  messageSent = false;


  constructor(
    private fb: FormBuilder
  ) {

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

  }


  get f() {

    return this.contactForm.controls;

  }


  sendMessage(): void {

    this.submitted = true;


    if (this.contactForm.invalid) {

      this.contactForm.markAllAsTouched();

      return;

    }


    console.log(
      'Contact Message:',
      this.contactForm.value
    );


    this.messageSent = true;

    this.contactForm.reset();

    this.submitted = false;

  }


  closeMessage(): void {

    this.messageSent = false;

  }
}
