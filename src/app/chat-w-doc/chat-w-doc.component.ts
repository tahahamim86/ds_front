import { Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-chat-w-doc',
  templateUrl: './chat-w-doc.component.html',
  styleUrls: ['./chat-w-doc.component.css']
})
export class ChatWDocComponent {
  doctors = [
    { name: 'Dr. A', specialty: 'Cardiology', photo: 'assets/images/docfemale.jpg' },
    { name: 'Dr. B', specialty: 'Neurology', photo: 'assets/images/docold.jpg' },
    { name: 'Dr. C', specialty: 'Ophthalmology', photo: 'assets/images/docold.jpg' },
  ];
  selectedDoctor: any = null;
  messages: any[] = [];
  newMessage: string = '';
  isRecording = false;

  selectDoctor(doc: any) {
    this.selectedDoctor = doc;
    this.messages = [
      { sender: 'doctor', type: 'text', content: `Bonjour, je suis ${doc.name}. Comment puis-je vous aider ?` }
    ];
  }

  sendMessage() {
    if (this.newMessage.trim() === '') return;
    this.messages.push({ sender: 'user', type: 'text', content: this.newMessage });
    this.newMessage = '';
    // Simulate reply
    setTimeout(() => {
      this.messages.push({ sender: 'doctor', type: 'text', content: 'Merci pour votre message.' });
    }, 1000);
  }

  sendFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.messages.push({ sender: 'user', type: 'file', fileName: file.name, fileUrl: URL.createObjectURL(file) });
  }

  startRecording() { this.isRecording = true; }
  stopRecording() { this.isRecording = false; }

}


interface Message {
  sender: 'user' | 'doctor';
  type: 'text' | 'file' | 'voice';
  content?: string;
  fileUrl?: string;
  fileName?: string;
}


