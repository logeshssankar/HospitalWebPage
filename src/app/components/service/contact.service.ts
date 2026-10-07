import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ContactMessage {

  name: string;

  email: string;

  phone?: string;

  subject: string;

  message: string;

}


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl =
    'http://localhost:8080/contact';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // SEND CONTACT MESSAGE
  // =====================================================

  sendMessage(
    contactMessage: ContactMessage
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      contactMessage
    );

  }

}