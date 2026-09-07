import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private departmentSubject = new Subject<string>();

  department$ = this.departmentSubject.asObservable();

  selectDepartment(department: string): void {
    this.departmentSubject.next(department);
  }
}
