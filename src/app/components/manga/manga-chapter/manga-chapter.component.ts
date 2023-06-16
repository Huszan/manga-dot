import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manga-chapter',
  templateUrl: './manga-chapter.component.html',
  styleUrls: ['./manga-chapter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaChapterComponent implements OnInit, OnDestroy {
  manga: MangaType | null = null;
  chapter: number = 0;
  mangaId: number = 0;
  isInitialized: boolean = false;

  mangaSub!: Subscription;

  constructor(
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _router: Router,
    private _mangaHttp: MangaHttpService,
    private _mangaService: MangaService,
    private _mangaHttpService: MangaHttpService,
    private _sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initMangaSub();
    this._getChapter();
    this._getMangaId();
    this._getManga();
  }

  private _getMangaId() {
    this.mangaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  private _getChapter() {
    this.chapter = Number(this.route.snapshot.paramMap.get('chapter'));
  }

  private initMangaSub() {
    this.mangaSub = this._mangaService.selectedManga$.subscribe((manga) => {
      this.manga = manga;
      this.checkIfMangaIsInitialized();
      console.log(this.manga, this.isInitialized);
      if (this.isInitialized) this._cdr.detectChanges();
    });
  }

  private _getManga() {
    if (
      !this._mangaService.selectedManga$.value ||
      this._mangaService.selectedManga$.value?.id !== this.mangaId
    ) {
      this._mangaService.requestManga(this.mangaId, () => {
        if (!this.isChapterValid) this.goToChapterSelect();
        this._mangaService.requestChapters(() => {
          this._mangaService.requestPages(this.chapter);
        });
      });
    } else {
      this.manga = this._mangaService.selectedManga$.value;
      if (!this.isChapterValid) this.goToChapterSelect();
      if (!this.manga.chapters || this.manga.chapters.length <= 0) {
        this._mangaService.requestChapters(() => {
          this._mangaService.requestPages(this.chapter);
        });
      } else if (
        !this.manga?.chapters![this.chapter].pages ||
        this.manga?.chapters![this.chapter].pages === []
      ) {
        this._mangaService.requestPages(this.chapter);
      }
    }
  }

  checkIfMangaIsInitialized() {
    this.isInitialized = !!(
      this.manga &&
      this.manga.chapters &&
      this.manga.chapters[this.chapter].pages
    );
  }

  goToChapterSelect() {
    this._router.navigate(['/manga', this.mangaId]);
  }

  navigateToPreviousChapter() {
    if (this.isFirstChapter) return;
    this.chapter--;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      this._mangaService.requestPages(this.chapter);
      window.scroll({ top: 0 });
    });
  }

  navigateToNextChapter() {
    if (this.isLastChapter) return;
    this.chapter++;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      this._mangaService.requestPages(this.chapter);
      window.scroll({ top: 0 });
    });
  }

  get isFirstChapter() {
    if (!this.manga) return false;
    return this.chapter === 0;
  }

  get isLastChapter() {
    if (!this.manga) return false;
    return this.chapter === this.manga.chapterCount - 1;
  }

  get isChapterValid() {
    if (!this.manga) return true;
    return this.chapter >= 0 && this.chapter <= this.manga.chapterCount - 1;
  }

  sanitizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnDestroy(): void {
    this.mangaSub.unsubscribe();
  }
}
