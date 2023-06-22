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

@Component({
  selector: 'app-manga-display',
  templateUrl: './manga-display.component.html',
  styleUrls: ['./manga-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaDisplayComponent implements OnInit, OnDestroy {
  manga: MangaType | null = null;
  user: UserType | null = null;

  private _userSub!: Subscription;
  private _mangaSub!: Subscription;

  fakeArray = FakeArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mangaService: MangaService,
    private mangaHttp: MangaHttpService,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this._initializeManga();
    this._initializeUser();
  }

  get mangaId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  private _initializeManga() {
    if (!this.mangaService.selectedManga$.value) {
      this.mangaService.requestManga(this.mangaId);
    }
    this._mangaSub = this.mangaService.selectedManga$.subscribe((manga) => {
      if (!manga) return;
      this.manga = manga;
      this._cdr.detectChanges();
      if (!this.manga.chapters || this.manga.chapters.length <= 0)
        this.mangaService.requestChapters();
    });
  }

  private _initializeUser() {
    this._userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
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
      if (res.status === 1) {
        this.mangaService.requestManga(this.mangaId);
      } else {
        this._snackbar.open(res.message, 'Close', { duration: 8000 });
      }
    });
  }

  onChapterSelect(chapter: number) {
    this.router.navigate(['manga', this.mangaId, chapter]);
  }

  ngOnDestroy() {
    this._userSub.unsubscribe();
    this._mangaSub.unsubscribe();
  }
}
