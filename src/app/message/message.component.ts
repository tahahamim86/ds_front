import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatbotService } from '../services/chatbot.service';
import { SpeechRecognitionService } from '../services/speech-recognition.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  isChatRoute = true;
  isFullscreen = false;
  userInput = '';
  isRecording = false;

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  chatHistory: { title?: string; messages: any[] }[] = [];
  activeChatIndex: number | null = null;

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private chatbotService: ChatbotService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const navEnd = event as NavigationEnd;
      this.isChatRoute = navEnd.urlAfterRedirects === '/chat_tech';
      this.isFullscreen = this.isChatRoute;
    });

    this.speechRecognitionService.recognizedText.subscribe((text) => {
      this.userInput = text;
      this.stopRecordingAndSend();
    });
  }

  // ---------------- Chat Handling ----------------
  get activeChatMessages() {
    return this.activeChatIndex !== null ? this.chatHistory[this.activeChatIndex].messages : [];
  }

  startNewChat() {
    this.chatHistory.push({ title: '', messages: [] });
    this.activeChatIndex = this.chatHistory.length - 1;
    this.userInput = '';
    setTimeout(() => this.scrollToBottom(), 50);
  }

  selectChat(index: number) {
    this.activeChatIndex = index;
    setTimeout(() => this.scrollToBottom(), 50);
  }

  deleteChat(index: number) {
    this.chatHistory.splice(index, 1);
    if (this.chatHistory.length === 0) {
      this.activeChatIndex = null;
    } else if (this.activeChatIndex! >= this.chatHistory.length) {
      this.activeChatIndex = this.chatHistory.length - 1;
    }
  }

  // ---------------- Messaging ----------------
  sendMessage() {
    if (!this.userInput.trim() || this.activeChatIndex === null) return;

    const time = new Date().toLocaleTimeString();
    this.chatHistory[this.activeChatIndex].messages.push({ user: this.userInput, time });

    this.chatbotService.sendMessage(this.userInput).subscribe(response => {
      if (response && response.response) {
        this.chatHistory[this.activeChatIndex!].messages.push({ bot: response.response, time });
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });

    this.userInput = '';
    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch {}
  }

  // ---------------- Voice Recording ----------------
  async toggleVoiceRecording() {
    if (this.isRecording) {
      this.stopRecordingAndSend();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      this.speechRecognitionService.startListening();

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => this.audioChunks.push(event.data);
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone', error);
    }
  }

  private stopRecordingAndSend() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.speechRecognitionService.stopListening();
      this.isRecording = false;

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const time = new Date().toLocaleTimeString();

        if (this.activeChatIndex !== null) {
          this.chatHistory[this.activeChatIndex].messages.push({ audioUrl, time });
          setTimeout(() => this.scrollToBottom(), 50);
        }

        this.userInput = '';
      };
    }
  }
}
