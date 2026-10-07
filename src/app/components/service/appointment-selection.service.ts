import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SelectedDoctor {
  id: number;
  name: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentSelectionService {

  private selectedDoctorSubject =
    new BehaviorSubject<SelectedDoctor | null>(null);

  selectedDoctor$ =
    this.selectedDoctorSubject.asObservable();

  selectDoctor(doctor: SelectedDoctor): void {
    this.selectedDoctorSubject.next(doctor);
  }

  clearSelection(): void {
    this.selectedDoctorSubject.next(null);
  }
}