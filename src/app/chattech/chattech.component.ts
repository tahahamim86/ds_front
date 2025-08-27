import { Component } from '@angular/core';

@Component({
  selector: 'app-chattech',
  templateUrl: './chattech.component.html',
  styleUrls: ['./chattech.component.css']
})
export class ChattechComponent {
  message:string =''
  messages: Array<{ text: string, isUser: boolean, timestamp: string }> = [
    { text: 'Hi', isUser: false, timestamp: '08:41' },
    { text: 'How can I help you?', isUser: true, timestamp: '08:55' },
    { text: 'There is a problem in your app.', isUser: false, timestamp: '10:13' },
    { text: 'Okay, I will tell the technical team about it and we will try our best to fix the issues.', isUser: true, timestamp: '11:07' },
    { text: 'Okay sir.', isUser: false, timestamp: '11:11' },
  ];
  userIcon: string = 'assets/images/avatar.png';
  otherIcon: string = 'assets/images/logo.png';

  sendMessage() {
    if (this.message.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.messages.push({ text: this.message, isUser: true, timestamp });
      this.message = '';
    }
  }
}
