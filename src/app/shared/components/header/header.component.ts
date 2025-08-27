import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit, TemplateRef, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ProfileService } from 'src/app/services/profile.service'; // Import ProfileService

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None, // Change to Emulated, ShadowDom, or None
})
export class HeaderComponent implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  public loggedIn: boolean = false;
  req: any = [];
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  openbar: boolean = false;
  profileImage: string = 'assets/images/avatar.png'; // Default image
  profileName: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authservice: AuthServiceService,
    private profileService: ProfileService // Inject ProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.shownotif();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe(
      (profile) => {
        if (profile && profile.fullName) {
          this.profileName = profile.fullName;
        }
        if (profile && profile.image) {
          this.profileImage = 'data:image/png;base64,' + profile.image;
        }
      },
      (error) => {
        console.error('Error loading profile in header:', error);
        // Optionally handle the error, e.g., display a default name
      }
    );
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  openTop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'top' });
  }

  openBottom(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'bottom' });
  }

  openNoBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: false });
  }

  openStaticBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdrop: 'static' });
  }

  openScroll(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { scroll: true });
  }

  openNoKeyboard(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { keyboard: false });
  }

  openNoAnimation(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { animation: false });
  }

  openCustomBackdropClass(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { backdropClass: 'bg-info' });
  }

  openCustomPanelClass(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'bg-info' });
  }

  toggleSideBar() {
    this.openbar = !this.openbar;
    this.toggleSideBarForMe.emit(this.openbar);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 3000);
  }

  private modalService = inject(NgbModal);
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.authservice.logout();
    this.router.navigateByUrl('/login');
    console.log("User logged out successfully");
  }

  clearFormData() {
    localStorage.removeItem('projet');
  }
  showUploadBox = false;
  notificationMessage: string = '';
  daysLeft: number = 0;


 shownotif() {
    const storedDate = localStorage.getItem('startDate');
    const currentDate = new Date();

    if (storedDate) {
      const startDate = new Date(storedDate);
      const futureDate = new Date(startDate);
      futureDate.setMonth(futureDate.getMonth() + 3);

      if (currentDate >= futureDate) {
        this.showUploadBox = true;
        this.notificationMessage = '';
      } else {
        const diffTime = futureDate.getTime() - currentDate.getTime();
        this.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.notificationMessage = `Upload option will be available in ${this.daysLeft} day(s).`;
      }
    } else {
      localStorage.setItem('startDate', currentDate.toISOString());
      this.daysLeft = 90;
      this.notificationMessage = `Upload option will be available in 90 day(s).`;
    }
  }
}
