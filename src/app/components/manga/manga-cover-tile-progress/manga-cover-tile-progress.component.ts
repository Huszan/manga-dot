import {
  ChangeDetectorRef,
  Component,
  Input,
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
  selector: 'app-manga-cover-tile-progress',
  templateUrl: './manga-cover-tile-progress.component.html',
  styleUrls: ['./manga-cover-tile-progress.component.scss'],
})
export class MangaCoverTileProgressComponent implements OnDestroy {
  @Input() manga!: MangaType;
  @Input() size?: number;

  private _readProgressList: ReadProgressType[] | null = null;

  subscriptions: Subscription[] = [];
  readProgress: ReadProgressType | undefined;

  actions: ActionButton[] = [];

  progressBarConfig = {
    wrapperStyle: 'position: absolute; transform: translateY(-100%)',
  };

  constructor(
    private _readProgressService: ReadProgressService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    const readProgressSub = _readProgressService.readProgressList$.subscribe(
      (readProgressList) => {
        this._readProgressList = readProgressList;
        this.updateReadProgress();
      }
    );
    this.subscriptions.push(readProgressSub);
  }

  initializeActions() {
    if (!this.readProgress) return;
    this.actions = [
      {
        name: 'Continue reading',
        icon: 'import_contacts',
        color: 'accent',
        isActive: true,
        navigation: {
          commands: [
            'manga',
            this.readProgress.mangaId,
            this.readProgress?.lastReadChapter,
          ],
          queryParams: { lastReadPage: this.readProgress?.lastReadPage },
        },
        action: () => {},
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
  }

  onRemoveProgress() {
    if (!this.readProgress || !this.readProgress.id) return;
    this._readProgressService.removeProgress(this.readProgress.id);
  }

  updateReadProgress() {
    if (!this.manga || !this._readProgressList) return;
    this.readProgress = this._readProgressList.find(
      (val) => val.mangaId === this.manga.id
    );
    this.initializeActions();
    this._cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manga']) {
      setTimeout(() => {
        this.updateReadProgress();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
