import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isScrolled = false;

  menuOpen = false;

  activeSection = 'home';

  navItems = [
    {
      label: 'Home',
      id: 'home',
    },
    {
      label: 'About',
      id: 'about',
    },
    {
      label: 'Services',
      id: 'services',
    },
    {
      label: 'Doctors',
      id: 'doctors',
    },
    {
      label: 'Departments',
      id: 'departments',
    },
    {
      label: 'Contact',
      id: 'contact',
    },
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;

    this.updateActiveSection();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    this.menuOpen = false;
  }

  updateActiveSection(): void {
    const sections = this.navItems.map((item) => item.id);

    sections.push('home');

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);

      if (!section) {
        continue;
      }

      const rect = section.getBoundingClientRect();

      if (rect.top <= 150 && rect.bottom >= 150) {
        this.activeSection = sectionId;

        break;
      }
    }
  }
}
