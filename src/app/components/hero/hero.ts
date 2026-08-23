import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
scrollToAppointment(): void {

    const section = document.getElementById('appointment');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }


  scrollToServices(): void {

    const section = document.getElementById('services');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }
}
