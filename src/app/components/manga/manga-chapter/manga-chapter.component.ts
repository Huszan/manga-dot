import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { MangaType } from '../../../types/manga.type';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manga-chapter',
  templateUrl: './manga-chapter.component.html',
  styleUrls: ['./manga-chapter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaChapterComponent implements OnInit, OnDestroy {
  manga$ = new BehaviorSubject<MangaType | undefined>(undefined);
  chapter: number = 0;
  mangaId: number = 0;
  data = {
    isFirstChapter: false,
    isLastChapter: false,
    isInitialized: false,
  };
  pages: SafeUrl[] = [];

  private _subscriptions: Subscription[] = [];

  constructor(
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _router: Router,
    private _mangaService: MangaService,
    private _mangaHttpService: MangaHttpService,
    private _sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._getChapter();
    this._getMangaId();
    const mangaSub = this._mangaSub().subscribe((manga) => {
      if (!manga) {
        return;
      }
      this._mangaHttpService
        .getMangaPages(manga!, this.chapter)
        .subscribe((res) => {
          if (res || res.length > 0) {
            this.pages = this.sanitizePages(res);
          }
          this.data.isInitialized = true;
          this._cdr.detectChanges();
        });
    });
    this._subscriptions.push(mangaSub);
  }

  private _mangaSub() {
    if (!this._mangaService.selectedManga$.value) {
      this._mangaService.getManga(this.mangaId);
    }
    return this._mangaService.selectedManga$.pipe(
      tap((manga) => {
        if (!manga) {
          return;
        }
        this.data.isFirstChapter = manga.startingChapter >= this.chapter;
        this.data.isLastChapter = manga.chapterCount <= this.chapter;
        this.manga$.next(manga);
      })
    );
  }

  private _getMangaId() {
    this.mangaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  private _getChapter() {
    this.chapter = Number(this.route.snapshot.paramMap.get('chapter'));
  }

  goToChapterSelect() {
    this._router.navigate(['/manga', this.mangaId]);
  }

  navigateToPreviousChapter() {
    if (this.data.isFirstChapter) return;

    this._router
      .navigate(['/manga', this.mangaId, this.chapter - 1])
      .then(() => {
        window.location.reload();
      });
  }

  navigateToNextChapter() {
    if (this.data.isLastChapter) return;
    this._router
      .navigate(['/manga', this.mangaId, this.chapter + 1])
      .then(() => {
        window.location.reload();
      });
  }

  sanitizePages(pages: []) {
    let sanitizedPages: SafeUrl[] = [];
    pages.forEach((el) => {
      sanitizedPages.push(this._sanitizer.bypassSecurityTrustUrl(el));
    });
    return sanitizedPages;
  }

  onError() {
    this._router.navigate(['']).then(() => {
      this._snackBar.open('Something went wrong. Try again later.', 'Ok');
    });
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
