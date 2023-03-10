import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutingModule } from '../../../app-routing.module';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  routes = this.routingModule.availableRoutes;

  constructor(private routingModule: AppRoutingModule) {}

  setTitleToDisplay(title: any) {
    title = String(title);
    return this.routingModule.getTitleDisplay(title);
  }
}
