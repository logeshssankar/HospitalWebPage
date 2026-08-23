import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
scrollToContact(): void {

    const section = document.getElementById('contact');

    section?.scrollIntoView({
      behavior: 'smooth'
    });

  }
}
