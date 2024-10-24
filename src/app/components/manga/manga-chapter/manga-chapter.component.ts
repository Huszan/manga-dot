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
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ReadProgressService } from 'src/app/services/data/read-progress.service';
import { ReadProgressType } from 'src/app/types/read-progress.type';
import { AuthService } from 'src/app/services/data/auth.service';

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
  isChapterAccesible: boolean = true;

  mangaSub!: Subscription;
  paramsSub!: Subscription;

  constructor(
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _router: Router,
    private _mangaService: MangaService,
    private _sanitizer: DomSanitizer,
    private _readProgressService: ReadProgressService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._initMangaSub();
    this._initSubToParams();
  }

  private _initSubToParams() {
    this.paramsSub = this._subToParams();
  }

  private _subToParams() {
    return this.route.params.subscribe((params) => {
      this.mangaId = Number(params['id']);
      this.chapter = Number(params['chapter']);
      this._getManga();
      this._cdr.detectChanges();
    });
  }

  private _initMangaSub() {
    this.mangaSub = this._mangaService.selectedManga$.subscribe((manga) => {
      this.manga = manga;
      this.checkIfMangaIsInitialized();
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
          this._mangaService.requestPages(this.chapter, (status) => {
            this.isChapterAccesible = status !== 'error';
          });
        });
      } else if (
        !this.manga?.chapters![this.chapter].pages ||
        this.manga?.chapters![this.chapter].pages.length === 0
      ) {
        this._mangaService.requestPages(this.chapter, (status) => {
          this.isChapterAccesible = status !== 'error';
        });
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
    this.navigateToChapter(this.chapter - 1);
  }

  navigateToNextChapter() {
    if (this.isLastChapter) return;
    this.navigateToChapter(this.chapter + 1);
  }

  navigateToChapter(chapter: number) {
    this.chapter = chapter;
    if (!this.isChapterValid) return;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      this._mangaService.requestPages(this.chapter);
      window.scroll({ top: 0 });
    });
  }

  onChapterSelect(event: any) {
    const chapter = event.value;
    this.navigateToChapter(chapter);
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

  onPageInView(index: number) {
    const userId = this._authService.currentUser$.value?.id;
    if (userId === undefined) return;
    const progress: ReadProgressType = {
      userId,
      mangaId: this.mangaId,
      lastReadChapter: this.chapter,
      lastReadPage: index,
    };
    this._readProgressService.updateProgress(progress);
  }

  ngOnDestroy(): void {
    this.mangaSub.unsubscribe();
    this._subToParams().unsubscribe();
  }
}
