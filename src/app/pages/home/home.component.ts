import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs'; // Import fromEvent

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private arrowElements: HTMLElement[] = [];
  private sidebarBtn: HTMLElement | null = null;
  private sidebar: HTMLElement | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private renderer: Renderer2, private router:Router) {}
  @Output() toggleSideBarForMe: EventEmitter<any>= new EventEmitter();
toggleSideBar(){
this.toggleSideBarForMe.emit();
setTimeout(()=>{ window.dispatchEvent( new Event('resize'));},3000);
}
color: string = 'black';
isDarkMode: boolean = false;
darkmode() {
  if (this.isDarkMode) {
    this.color = 'black';
  } else {
    this.color = '#778C7B';
  }
  this.isDarkMode = !this.isDarkMode;
}
istext =false;
  ngOnInit(): void {
    // Select arrow elements and sidebar button
    this.arrowElements = Array.from(document.querySelectorAll(".arrow")) as HTMLElement[];
    this.sidebarBtn = document.querySelector(".bxs-caret-left-circle");
    this.sidebar = document.querySelector(".sidebar");

    // Add event listeners for arrows
    this.arrowElements.forEach(arrow => {
      const arrowClick$ = fromEvent(arrow, 'click').subscribe((event: Event) => {
        this.toggleMenu(event);

      });
      this.subscriptions.add(arrowClick$);
    });

    // Add event listener for sidebar button
    if (this.sidebarBtn) {
      const sidebarClick$ = fromEvent(this.sidebarBtn, 'click').subscribe(() => {
        this.toggleSidebar(); this.istext=!this.istext;
      });
      this.subscriptions.add(sidebarClick$);
    }
  }

  toggleMenu(event: Event): void {
    const target = event.target as HTMLElement;
    const arrowParent = target.parentElement?.parentElement;
    if (arrowParent) {
      arrowParent.classList.toggle("showMenu");
    }
  }

  toggleSidebar(): void {
    if (this.sidebar) {
      this.sidebar.classList.toggle("close");
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }

showModal = false;

openTokenPopup(event: MouseEvent): void {
  event.preventDefault();
  this.showModal = true;
}
logout(){

}
  isDiagnosisOpen: boolean = false;

    toggleDiagnosisSubMenu() {
        this.isDiagnosisOpen = !this.isDiagnosisOpen;
    }

}
