
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  public recognizedText = new EventEmitter<string>();

  constructor() {
    const { webkitSpeechRecognition }: IWindow = <IWindow>(<unknown>window);
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      this.recognizedText.emit(text); // Emit recognized text
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };
  }

  startListening(): void {
    this.recognition.start();
  }

  stopListening(): void {
    this.recognition.stop();
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
