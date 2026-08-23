import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from "./components/hero/hero";
import { About } from "./components/about/about";
import { Departments } from "./components/departments/departments";
import { Doctors } from "./components/doctors/doctors";
import { Testimonials } from "./components/testimonials/testimonials";
import { Contact } from "./components/contact/contact";
import { Navbar } from './components/navbar/navbar';
import { Services } from './components/services/services';
import { WhyChooseUs } from './components/why-choose-us/why-choose-us';
import { Appointment } from './components/appointment/appointment';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Hero, About, Departments, Doctors, Testimonials, Contact,Services,WhyChooseUs,Appointment,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('nursery');

  ngAfterViewInit(): void {

    this.setupRevealAnimation();
}

private setupRevealAnimation(): void {

    const elements =
      document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right'
      );


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'active'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.12
        }

      );


    elements.forEach(element => {

      observer.observe(element);

    });

  }
}
