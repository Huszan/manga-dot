import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AppRoutingModule } from '../../../app-routing.module';
import { Route } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() sidenavDrawer!: MatDrawer;

  isMobile = window.innerWidth < 800;
  homeRoute: Route = this.routingModule.homeRoute;

  constructor(private routingModule: AppRoutingModule) {}

  @HostListener('window:resize', [`$event`])
  onWindowResize(event: any) {
    this.isMobile = event.target.innerWidth < 800;
  }

  toggleSidenav() {
    if (!this.sidenavDrawer) return;
    this.sidenavDrawer.toggle();
  }
}
