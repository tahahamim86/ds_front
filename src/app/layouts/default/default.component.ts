import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent {
  constructor(private router: Router,private authService:AuthServiceService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => console.log('Navigated to:', event));
  }
  userId: string | null = null;  // Declare userId as a string or null

isChatVisible = false;
  isChatRoute = false;

  

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }
ngOnInit(): void {
  this.userId = this.authService.getUserId();
  console.log('User ID:', this.userId);


}

  
  sideBarOpen=true;
  SideBarToggler(){
    this.sideBarOpen=!this.sideBarOpen;
  }
  isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  color = 'white'; // Default sidebar background
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  }
}
