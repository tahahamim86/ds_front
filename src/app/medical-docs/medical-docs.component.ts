import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalImageComponent } from '../modal-image/modal-image.component';
import { DiagnosisManagementService } from '../services/diagnosis_management.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-medical-docs',
  templateUrl: './medical-docs.component.html',
  styleUrls: ['./medical-docs.component.css']
})
export class MedicalDocsComponent implements OnInit {
  diagnoses: any[] = [];
  displayedColumns: string[] = ['image', 'show', 'delete', 'date'];
  documents: any[] = [];
  selectedDocument: any;
  currentFolder: string | null = null;
  folderDocuments: { [key: string]: any[] } = {};

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private diagnosisManagementService: DiagnosisManagementService,
    private authService: AuthServiceService  // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentFolder = params.get('folderId');
      const email = this.authService.getUserId();  // ✅ Get email from AuthService

      if (email) {
        this.getDiagnosis(email);  // ✅ Fetch using user's email
      } else {
        console.error('User email not available');
      }

      this.loadDocuments(this.currentFolder);
    });
  }

  getDiagnosis(email: string): void {
    this.diagnosisManagementService.getDiagnosesByUserEmail(email).subscribe({
      next: (data) => {
        this.diagnoses = data;
        console.log('Fetched Diagnoses for email', email, ':', this.diagnoses);
        this.loadDocuments(this.currentFolder);
      },
      error: (err) => console.error('Error fetching diagnoses:', err)
    });
  }

  loadDocuments(folderId: string | null): void {
    if (!folderId || !this.diagnoses.length) {
      this.documents = [];
      return;
    }

    this.folderDocuments = {
      'Scanned Images': this.diagnoses.map(diagnosis => ({
        id: diagnosis.id,
        imageUrl: diagnosis.image ? `data:image/jpeg;base64,${diagnosis.image}` : 'assets/images/avatar.png',
        description: diagnosis.diagnostic_details || 'No description available',
        disease_name: diagnosis.disease_name,
        dateAdded: diagnosis.diagnosis_Date,
        accuracy: diagnosis.accuracy || 'N/A'
      })),
      'Ordonances': this.diagnoses.map(diagnosis => ({
        id: diagnosis.id,
        imageUrl: diagnosis.image ? `data:image/jpeg;base64,${diagnosis.image}` : 'assets/images/avatar.png',
        description: diagnosis.diagnostic_details || 'No description available',
        diseaseName: diagnosis.disease_name,
        dateAdded: new Date(),
        diseaseInfo: diagnosis.disease_info || 'No additional info available',
        accuracy: diagnosis.accuracy || 'N/A'
      }))
    };

    this.documents = this.folderDocuments[folderId] || [];
    if (!this.documents.length) {
      console.warn('No documents found for:', folderId);
    }
  }

  navigateToFolder(folderId: string): void {
    this.router.navigate(['medical-docs', folderId]);
  }

  showImage(document: any): void {
    this.dialog.open(ModalImageComponent, {
      data: document
    });
  }

  openDeleteModal(document: any) {
    this.selectedDocument = document;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: { documentName: document.disease_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteDocumentConfirmed();
      }
    });
  }

  deleteDocumentConfirmed() {
    if (this.selectedDocument) {
      this.deleteDiagnosis(this.selectedDocument.id).subscribe(
        () => {
          this.documents = this.documents.filter(doc => doc.id !== this.selectedDocument.id);
          console.log('Document deleted successfully');
        },
        (error) => {
          console.error('Error deleting document:', error);
        }
      );
    }
  }

  deleteDiagnosis(id: number) {
    return this.diagnosisManagementService.deleteDiagnosis(id);
  }
}
