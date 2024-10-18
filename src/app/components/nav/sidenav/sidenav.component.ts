import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppRoutingModule } from '../../../app-routing.module';
import { Route, Router, Routes } from '@angular/router';
import { AuthService } from '../../../services/data/auth.service';
import { UserType } from '../../../types/user.type';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() drawer!: MatDrawer;
  routes: Routes = this._routingModule.availableRoutes.value;
  user: UserType | null = null;

  userSub!: Subscription;
  routesSub!: Subscription;

  constructor(
    private _routingModule: AppRoutingModule,
    private _router: Router,
    private _userManager: AuthService,
    private _cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userSub = this.subscribeToUser();
    this.routesSub = this.subscribeToRoutes();
  }

  private subscribeToRoutes() {
    return this._routingModule.availableRoutes.subscribe((routes) => {
      this.routes = routes;
      this._cdr.detectChanges();
    });
  }

  private subscribeToUser() {
    return this._userManager.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  getDisplay(index: number) {
    return this._routingModule.getTitleDisplay(
      String(this.routes[index].title)
    );
  }

  onLogoutClick() {
    this._userManager.logout()?.subscribe((res) => {
      this.drawer.close();
      this._snackbar.open(
        res.message ? res.message : 'Something went wrong. Try again later.',
        'Close',
        { duration: 8000 }
      );
    });
  }

  onRouteClick(route?: Route) {
    if (route) {
      this._router.navigate([route.path]);
    }
    this.drawer.close();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.routesSub.unsubscribe();
  }
}
