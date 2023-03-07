import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IMangaForm} from "../../../types/manga-form.type";

@Component({
  selector: 'app-manga-front-display',
  templateUrl: './manga-front-display.component.html',
  styleUrls: ['./manga-front-display.component.scss']
})
export class MangaFrontDisplayComponent {

  @Input() manga!: IMangaForm;
  @Input() size: 'big' | 'med' | 'small' = 'med';
  @Output() clickedRead = new EventEmitter();

  onClickRead(event: any) {
    this.clickedRead.emit(event);
  }
}
