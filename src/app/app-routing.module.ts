import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { MessageComponent } from './message/message.component';
import { LoginComponent } from './auth/login/login.component';
import { ChattechComponent } from './chattech/chattech.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { MedicalDocsComponent } from './medical-docs/medical-docs.component';
import { RespiratoryDiagnosisComponent } from './respiratory-diagnosis/respiratory-diagnosis.component';
import { BraintumorComponent } from './braintumor/braintumor.component';
import { RetinopathyComponent } from './retinopathy/retinopathy.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';

import { CardiologyDiagnosisComponent } from './cardiology-diagnosis/cardiology-diagnosis.component';
import { MedicalFormComponent } from './medical-form/medical-form.component';
import { AppointementsComponent } from './appointements/appointements.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { ChatWDocComponent } from './chat-w-doc/chat-w-doc.component';
import { PresentationComponent } from './homepage/presentation/presentation.component';

const routes: Routes = [
  // Public routes
{
path:'/home',
component:PresentationComponent,
canActivate:[BeforeLoginService]
},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [BeforeLoginService],
  },

  // Protected routes (require authentication)
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AfterLoginService],
    children: [
      { path: '', component: DashboardComponent }, // Default dashboard route
      { path: 'apichat', component: MessageComponent },
      { path: 'chat_tech', component: MessageComponent },
      { path: 'respiratory-diagnosis', component: RespiratoryDiagnosisComponent },
      { path: 'retinopathy-diagnosis', component: RetinopathyComponent },
      { path: 'cardiology-diagnosis', component: CardiologyDiagnosisComponent },
      { path: 'brain-diagnosis', component: BraintumorComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'password-reset', component: PasswordresetComponent },
      {path:'medical-form',component:MedicalFormComponent},
      {path:'appointement',component:AppointementsComponent},
       {path:'book-appointment',component:BookAppointmentComponent},
        {path:'messenger-w-doc',component:ChatWDocComponent},
      {
        path: 'medical-docs',
        children: [
          { path: '', component: MedicalDocsComponent },
          { path: ':folderId', component: MedicalDocsComponent },
        ],
      },
    ],
  },

  // Redirect to home if no path matches
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

