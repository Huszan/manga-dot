import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutingModule } from '../../../app-routing.module';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  routes!: Routes;
  titles: string[] = [];

  constructor(private routingModule: AppRoutingModule) {
    this.getDefinedRoutes();
    this.setupTitles();
  }

  getDefinedRoutes() {
    this.routes = this.routingModule.availableRoutes.filter((el) => {
      return el.redirectTo === undefined;
    });
  }

  setupTitles() {
    this.routes.forEach((el) => {
      let title = this.routingModule.getTitleDisplay(String(el.title));
      this.titles.push(title);
    });
  }
}
