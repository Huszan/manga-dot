import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaType } from '../../../types/manga.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { FakeArray } from '../../../utils/fakeArray';
import { AuthService } from '../../../services/data/auth.service';
import { UserType } from '../../../types/user.type';
import { Subscription } from 'rxjs';
import { LikeType } from '../../../types/like.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { ChapterType } from '../../../types/chapter.type';
import { Tags } from '../manga-browse/manga-browse.component';
import { ReadProgressService } from 'src/app/services/data/read-progress.service';
import { ReadProgressType } from 'src/app/types/read-progress.type';

@Component({
  selector: 'app-manga-display',
  templateUrl: './manga-display.component.html',
  styleUrls: ['./manga-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaDisplayComponent implements OnInit, OnDestroy {
  [x: string]: any;
  manga: MangaType | null = null;
  user: UserType | null = null;
  readProgress: ReadProgressType | null = null;

  private _userSub!: Subscription;
  private _mangaSub!: Subscription;
  private _progressSub!: Subscription;

  allTags = Tags;
  fakeArray = FakeArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mangaService: MangaService,
    private mangaHttp: MangaHttpService,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService,
    private _snackbar: MatSnackBar,
    private _readProgressService: ReadProgressService
  ) {}

  ngOnInit() {
    this._initializeManga();
    this._initializeUser();
    this._initializeProgress();
  }

  get mangaId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  private _initializeManga() {
    if (
      !this.mangaService.selectedManga$.value ||
      !this.mangaService.selectedManga$.value.chapters
    ) {
      this.mangaService.requestChapters(this.mangaId);
    }
    this._mangaSub = this.mangaService.selectedManga$.subscribe((manga) => {
      this.manga = manga;
      this._cdr.detectChanges();
    });
  }

  private _initializeUser() {
    this._userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  private _initializeProgress() {
    this._progressSub = this._readProgressService.readProgressList$.subscribe(
      (list) => {
        if (this.manga === null) return;
        const progress = list?.filter((el) => el.mangaId === this.manga!.id)[0];
        if (progress) {
          this.readProgress = progress;
          this._cdr.detectChanges();
        }
      }
    );
  }

  get isLikedByUser() {
    if (this.user === null) {
      return false;
    }
    for (let like of this.manga?.likes || []) {
      if (like.userId === this.user?.id) {
        return true;
      }
    }
    return false;
  }

  onLike() {
    if (!this.user) {
      this._snackbar.open('You need to be logged in', 'Close', {
        duration: 8000,
      });
      return;
    }
    const like: LikeType = {
      mangaId: this.manga?.id!,
      userId: this.user?.id!,
    };
    this.mangaHttp.likeManga(like).subscribe((res) => {
      if (res.status === 'success') {
        this.mangaService.requestManga(this.mangaId);
      } else if (res.message) {
        this._snackbar.open(res.message, 'Close', { duration: 8000 });
      }
    });
  }

  onChapterSelect(chapter: number) {
    this.router.navigate(['manga', this.mangaId, chapter]);
  }

  onContinueReading() {
    this.router.navigate(
      ['manga', this.mangaId, this.readProgress?.lastReadChapter],
      { queryParams: { lastReadPage: this.readProgress?.lastReadPage } }
    );
  }

  ngOnDestroy() {
    this._userSub.unsubscribe();
    this._mangaSub.unsubscribe();
    this._progressSub.unsubscribe();
  }
}
