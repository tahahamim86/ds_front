import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  /**
   * Determines if the user can access a route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login page if not authenticated
    return this.router.createUrlTree(['/login']);
  }
}
