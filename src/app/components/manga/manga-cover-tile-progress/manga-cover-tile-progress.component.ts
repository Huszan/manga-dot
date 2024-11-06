import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReadProgressService } from 'src/app/services/data/read-progress.service';
import { ActionButton } from 'src/app/types/action-button.type';
import { MangaType } from 'src/app/types/manga.type';
import { ReadProgressType } from 'src/app/types/read-progress.type';

@Component({
  selector: 'app-manga-cover-tile-box',
  templateUrl: './manga-cover-tile-progress.component.html',
  styleUrls: ['./manga-cover-tile-progress.component.scss'],
})
export class MangaCoverTileProgressComponent implements OnDestroy, OnChanges {
  @Input() manga!: MangaType;
  @Input() size?: number;
  @Input() onRead: any = () => {};

  subscriptions: Subscription[] = [];

  private _readProgressList: ReadProgressType[] | undefined;
  readProgress: ReadProgressType | undefined;
  progressPercent: string = '0%';

  actions: ActionButton[] = [
    {
      icon: 'import_contacts',
      color: 'accent',
      isActive: true,
      action: () => this.onContinueReading(),
    },
    {
      icon: 'close',
      isActive: true,
      confirmData: {
        title: `Are you sure you want to remove your reading progress?`,
        desc: `This action can't be reversed`,
      },
      action: () => this.onRemoveProgress(),
    },
  ];

  constructor(
    private _readProgressService: ReadProgressService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    const readProgressSub = _readProgressService.readProgressList$.subscribe(
      (readProgressList) => {
        this._readProgressList = readProgressList
          ? readProgressList
          : undefined;
        this.updateReadProgress();
      }
    );
    this.subscriptions.push(readProgressSub);
  }

  onContinueReading() {
    if (!this.readProgress) return;
    this._router.navigate(
      ['manga', this.readProgress.mangaId, this.readProgress?.lastReadChapter],
      { queryParams: { lastReadPage: this.readProgress?.lastReadPage } }
    );
  }

  onRemoveProgress() {
    if (!this.readProgress || !this.readProgress.id) return;
    this._readProgressService.removeProgress(this.readProgress.id);
  }

  updateReadProgress() {
    if (!this.manga || !this._readProgressList) return;
    this.readProgress = this._readProgressList?.find(
      (val) => val.mangaId === this.manga.id
    );
    this._cdr.detectChanges();
  }

  getProgressPercent() {
    if (!this.readProgress || !this.manga || !this.manga.chapterCount)
      return '0%';
    const num = Math.ceil(
      (this.readProgress?.lastReadChapter / this.manga.chapterCount) * 100
    );
    return `${num}%`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manga']) {
      setTimeout(() => {
        this.updateReadProgress();
        this.progressPercent = this.getProgressPercent();
        this._cdr.detectChanges();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
