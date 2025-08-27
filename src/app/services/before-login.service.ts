import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  /**
   * Allows access only if the user is NOT authenticated.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to dashboard if already authenticated
    return this.router.createUrlTree(['/']);
  }
}