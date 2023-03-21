import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IManga } from '../../../types/manga.type';

@Component({
  selector: 'app-manga-front-display',
  templateUrl: './manga-front-display.component.html',
  styleUrls: ['./manga-front-display.component.scss'],
})
export class MangaFrontDisplayComponent {
  @Input() manga!: IManga;
  @Output() onRead = new EventEmitter();

  onClickRead(event: any) {
    this.onRead.emit(event);
  }
}
