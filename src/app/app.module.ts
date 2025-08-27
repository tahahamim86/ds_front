import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModule } from './layouts/default/default.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StreamChatModule, StreamAutocompleteTextareaModule } from 'stream-chat-angular';
import { PresentationComponent } from './homepage/presentation/presentation.component';
import { FooterComponent } from './homepage/footer/footer.component';
import { NavbarComponent } from './homepage/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    PresentationComponent,
    FooterComponent,
    NavbarComponent,
    
  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DefaultModule,
    BrowserAnimationsModule,
    StreamChatModule,
    StreamAutocompleteTextareaModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
