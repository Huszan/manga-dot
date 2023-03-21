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
  routes: Routes = this.routingModule.availableRoutes;

  constructor(private routingModule: AppRoutingModule) {}
}
