import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: number;
  patientName: string;
  age: number;
  sex: string;
  email: string;
  phone: string;
  department: string;
  doctor?: string;
  appointmentDate: string;
  appointmentTime: string;
  message?: string;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(
    appointment: Appointment
  ): Observable<Appointment> {

    return this.http.post<Appointment>(
      this.apiUrl,
      appointment
    );
  }

  getAllAppointments(): Observable<Appointment[]> {

    return this.http.get<Appointment[]>(
      this.apiUrl
    );
  }

  getAppointmentById(
    id: number
  ): Observable<Appointment> {

    return this.http.get<Appointment>(
      `${this.apiUrl}/${id}`
    );
  }

  deleteAppointment(
    id: number
  ): Observable<string> {

    return this.http.delete<string>(
      `${this.apiUrl}/${id}`
    );
  }
}