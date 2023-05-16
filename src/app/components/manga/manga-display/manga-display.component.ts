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

@Component({
  selector: 'app-manga-display',
  templateUrl: './manga-display.component.html',
  styleUrls: ['./manga-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaDisplayComponent implements OnInit, OnDestroy {
  manga: MangaType | undefined = undefined;
  user: UserType | null = null;

  private _userSub!: Subscription;
  private _mangaSub!: Subscription;

  fakeArray = FakeArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mangaService: MangaService,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this._initializeManga();
    this._userSub = this._auth.currentUser$.subscribe((user) => {
      this.user = user;
      this._cdr.detectChanges();
    });
  }

  get mangaId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  private _initializeManga() {
    if (!this.mangaService.selectedManga$.value) {
      this._loadManga();
    }
    this._mangaSub = this.mangaService.selectedManga$.subscribe((manga) => {
      this.manga = manga;
      this._cdr.detectChanges();
    });
  }

  private _loadManga() {
    this.mangaService.getManga(this.mangaId).subscribe((res) => {
      this.mangaService.selectedManga$.next(res[0]);
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
      this._snackbar.open('Only logged in users can like manga', '', {
        duration: 2000,
      });
      return;
    }
    const like: LikeType = {
      mangaId: this.manga?.id!,
      userId: this.user?.id!,
    };
    this.mangaService.likeManga(like).subscribe((res) => {
      if (res.status === 1) {
        this.mangaService.getMangaList();
        this._loadManga();
      } else {
        this._snackbar.open(res.message, 'Ok', { duration: 5000 });
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
