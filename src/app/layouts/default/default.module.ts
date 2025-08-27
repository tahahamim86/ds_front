import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { AreaComponent } from 'src/app/shared/widget/area/area.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { MessageComponent } from 'src/app/message/message.component';
import { ChatbotServiceService } from 'src/app/services/chatbot-service.service';
import { LoginComponent } from 'src/app/auth/login/login.component';
import {MatTableModule} from '@angular/material/table';
import { ChattechComponent } from 'src/app/chattech/chattech.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { MedicalFormComponent } from 'src/app/medical-form/medical-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProfileComponent } from 'src/app/profile/profile.component';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { PasswordresetComponent } from 'src/app/passwordreset/passwordreset.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MedicalDocsComponent } from 'src/app/medical-docs/medical-docs.component';
import { ModalImageComponent } from 'src/app/modal-image/modal-image.component';
import { RespiratoryDiagnosisComponent } from 'src/app/respiratory-diagnosis/respiratory-diagnosis.component';
import { AuthInterceptor } from 'src/app/services/auth.interceptor';
import { BraintumorComponent } from 'src/app/braintumor/braintumor.component';
import { RetinopathyComponent } from 'src/app/retinopathy/retinopathy.component';
import { CardiologyDiagnosisComponent } from 'src/app/cardiology-diagnosis/cardiology-diagnosis.component';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Token } from '@angular/compiler';
import { TokenmodalComponent } from 'src/app/tokenmodal/tokenmodal.component';
import { AppointementsComponent } from 'src/app/appointements/appointements.component';
import { BookAppointmentComponent } from 'src/app/book-appointment/book-appointment.component';
import { ChatWDocComponent } from 'src/app/chat-w-doc/chat-w-doc.component';



@NgModule({
  declarations: [
    DefaultComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    AreaComponent,
    DashboardComponent,
    HomeComponent,
    SidebarComponent,
    
    MessageComponent,LoginComponent,ChattechComponent,RegisterComponent,
    MedicalFormComponent,
    ProfileComponent,
    PasswordresetComponent,
    MedicalDocsComponent,
    ModalImageComponent,
    RespiratoryDiagnosisComponent,
    BraintumorComponent,
    RetinopathyComponent,
    CardiologyDiagnosisComponent,
    DeleteConfirmationComponent,
    TokenmodalComponent,
    AppointementsComponent,
    BookAppointmentComponent,
    ChatWDocComponent
  ],


  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatButtonModule,
    MatSidenavModule,
    MatTreeModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    MatNativeDateModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule

   ],
  exports: [
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AreaComponent,
    HomeComponent,
    SidebarComponent


  ],
  providers: [ChatbotServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],


})
export class DefaultModule { }
