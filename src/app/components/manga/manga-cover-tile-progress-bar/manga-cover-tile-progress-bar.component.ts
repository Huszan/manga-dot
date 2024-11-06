import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MangaType } from 'src/app/types/manga.type';
import { ReadProgressType } from 'src/app/types/read-progress.type';

export interface MangaCoverTileProgressBarConfig {
  wrapperStyle?: string;
  barStyle?: string;
}

@Component({
  selector: 'app-manga-cover-tile-progress-bar',
  templateUrl: './manga-cover-tile-progress-bar.component.html',
  styleUrls: ['./manga-cover-tile-progress-bar.component.scss'],
})
export class MangaCoverTileProgressBarComponent implements OnChanges {
  @ViewChild('progressWrapper') progressWrapper!: ElementRef;
  @ViewChild('progress') progressBar!: ElementRef;

  @Input() manga?: MangaType;
  @Input() readProgress?: ReadProgressType;
  @Input() config?: MangaCoverTileProgressBarConfig;

  progressPercent: string = '0%';

  constructor(private _cdr: ChangeDetectorRef) {}

  getProgressPercent() {
    if (!this.readProgress || !this.manga || !this.manga.chapterCount)
      return '0%';
    const num = Math.ceil(
      (this.readProgress?.lastReadChapter / this.manga.chapterCount) * 100
    );
    return `${num}%`;
  }

  updateStyle() {
    if (!this.progressWrapper || !this.progressBar || !this.config) return;
    if (this.config.barStyle)
      this.progressBar.nativeElement.style = this.config.barStyle;
    if (this.config.wrapperStyle)
      this.progressWrapper.nativeElement.style = this.config.wrapperStyle;
    this.progressBar.nativeElement.style.width = this.progressPercent;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readProgress']) {
      setTimeout(() => {
        this.progressPercent = this.getProgressPercent();
        this.updateStyle();
        this._cdr.detectChanges();
      }, 0);
    }
  }
}
