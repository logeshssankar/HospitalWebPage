import { Component, signal } from '@angular/core';
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
export class App {
  protected readonly title = signal('nursery');
  
}
