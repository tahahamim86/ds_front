import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private auth:AuthServiceService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const requiredRole = route.data['role'];

    const userRole = this.tokenService.getRole();

    if (this.tokenService.loggedIn() && userRole === requiredRole) {
      return true;
    }
    else{
 
      this.router.navigateByUrl('/');
    return false;
    }
     }
  
}
