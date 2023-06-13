import { Injectable } from '@angular/core';
import { AuthService } from './data/auth.service';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    let authByToken = this.auth.authByToken();
    if (authByToken) {
      return authByToken.subscribe((res) => {
        let user = res.data;
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }
        if (!route.data && !route.data['roles']) return true;
        const requiredRoles: string[] = route.data['roles'];
        const userRole: string = user.accountType;
        if (requiredRoles.includes(userRole)) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      });
    }
    return false;
  }
}
