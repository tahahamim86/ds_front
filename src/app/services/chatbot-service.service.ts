import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/chatbot/'; // Replace with your API endpoint
  constructor(private http: HttpClient) { }
  SendMessage(messageData: { message: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, messageData);
  }
  private apiUrl1 = 'http://127.0.0.1:8000/api/chatbotchronique/'; // Replace with your API endpoint

    // Send user message to chatbot API
    ChronicMessage(message: string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const body = { message: message };

      return this.http.post<any>(this.apiUrl1, body, { headers });
    }
}
