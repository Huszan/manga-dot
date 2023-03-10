import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() sidenavDrawer!: MatDrawer;

  constructor() {}

  toggleSidenav() {
    if (!this.sidenavDrawer) return;
    this.sidenavDrawer.toggle();
  }
}
