import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-screen-loader',
  templateUrl: './full-screen-loader.component.html',
  styleUrls: ['./full-screen-loader.component.scss'],
})
export class FullScreenLoaderComponent {
  @Input() displayText: string | undefined;
}
