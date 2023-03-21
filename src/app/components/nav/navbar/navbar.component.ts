import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AppRoutingModule } from '../../../app-routing.module';
import { Route } from '@angular/router';
import { MangaGenre } from '../../../types/manga.type';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() sidenavDrawer!: MatDrawer;

  homeRoute: Route = this.routingModule.homeRoute;

  constructor(private routingModule: AppRoutingModule) {}

  toggleSidenav() {
    if (!this.sidenavDrawer) return;
    this.sidenavDrawer.toggle();
  }
}
