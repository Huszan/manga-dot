import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ReadProgressService } from 'src/app/services/data/read-progress.service';
import { ReadProgressType } from 'src/app/types/read-progress.type';
import { AuthService } from 'src/app/services/data/auth.service';
import { PageType } from 'src/app/types/page.type';

@Component({
  selector: 'app-manga-chapter',
  templateUrl: './manga-chapter.component.html',
  styleUrls: ['./manga-chapter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaChapterComponent implements OnInit, OnDestroy {
  @ViewChild('pagesWrapperRef') pagesWrapper: ElementRef | undefined =
    undefined;
  manga: MangaType | null = null;
  pages: PageType[] = [];
  chapterId: number = 0;
  mangaId: number = 0;
  currentPage: number = 1;
  isChapterAccesible: boolean = true;
  lastReadPage: number | undefined;

  loadedImages: boolean[] = [];
  isImagesLoaded: boolean = false;

  mangaSub!: Subscription;
  paramsSub!: Subscription;
  queryParamsSub!: Subscription;

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
    this._initSubToParams();
    this._initSubToQueryParams();
    this._initMangaSub();
  }

  pageWrapperClass(i: number): string {
    return `page-wrapper${
      this.lastReadPage && this.lastReadPage === i ? ' scroll-target' : ''
    }`;
  }

  private _initSubToParams() {
    this.paramsSub = this._subToParams();
  }

  private _initSubToQueryParams() {
    this.queryParamsSub = this._subToQueryParams();
  }

  private _subToParams() {
    return this.route.params.subscribe((params) => {
      this.mangaId = Number(params['id']);
      this.chapterId = Number(params['chapter']);
      this._getManga(() => {
        this.isImagesLoaded = false;
        this._getPages();
        this._cdr.detectChanges();
      });
    });
  }

  private _subToQueryParams() {
    return this.route.queryParams.subscribe((params) => {
      this.lastReadPage = Number(params['lastReadPage']);
    });
  }

  private _initMangaSub() {
    this.mangaSub = this._mangaService.selectedManga$.subscribe((manga) => {
      this.manga = manga;
      this._getPages();
    });
  }

  private _getPages() {
    if (this.isInitialized) {
      this.pages = this.manga!.chapters![this.chapterId].pages;
      this.loadedImages = new Array(this.pages.length).fill(false);
      this._cdr.detectChanges();
      this.initializeIntersectionObserver();
    }
  }

  private _getManga(cb: any = () => {}) {
    const selectedManga = this._mangaService.selectedManga$.value;
    if (!selectedManga || selectedManga.id !== this.mangaId) {
      this._mangaService.requestManga(this.mangaId, () => {
        if (!this.isChapterValid) this.goToChapterSelect();
        this._mangaService.requestChapters(() => {
          this._mangaService.requestPages(this.chapterId, () => {
            cb();
          });
        });
      });
    } else {
      if (!this.isChapterValid) this.goToChapterSelect();
      if (!selectedManga.chapters || selectedManga.chapters.length <= 0) {
        this._mangaService.requestChapters(() => {
          this._mangaService.requestPages(this.chapterId, (status) => {
            this.isChapterAccesible = status !== 'error';
            cb();
          });
        });
      } else if (
        !selectedManga.chapters![this.chapterId].pages ||
        selectedManga.chapters![this.chapterId].pages.length === 0
      ) {
        this._mangaService.requestPages(this.chapterId, (status) => {
          this.isChapterAccesible = status !== 'error';
          cb();
        });
      } else {
        cb();
      }
    }
  }

  get isInitialized() {
    return !!(
      this.manga &&
      this.manga.chapters &&
      this.manga.chapters[this.chapterId].pages
    );
  }

  goToChapterSelect() {
    this._router.navigate(['/manga', this.mangaId]);
  }

  navigateToPreviousChapter() {
    if (this.isFirstChapter) return;
    this.navigateToChapter(this.chapterId - 1);
  }

  navigateToNextChapter() {
    if (this.isLastChapter) return;
    this.navigateToChapter(this.chapterId + 1);
  }

  navigateToChapter(chapter: number) {
    this.chapterId = chapter;
    if (!this.isChapterValid) return;
    this._router.navigate(['/manga', this.mangaId, this.chapterId]);
  }

  onChapterSelect(event: any) {
    const chapter = event.value;
    this.navigateToChapter(chapter);
  }

  get isFirstChapter() {
    if (!this.manga) return false;
    return this.chapterId === 0;
  }

  get isLastChapter() {
    if (!this.manga) return false;
    return this.chapterId === this.manga.chapterCount - 1;
  }

  get isChapterValid() {
    if (!this.manga) return true;
    return this.chapterId >= 0 && this.chapterId <= this.manga.chapterCount - 1;
  }

  sanitizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  onPageInView(index: number) {
    this.currentPage = index + 1;
    if (!this.lastReadPage || this.lastReadPage < index) {
      const userId = this._authService.currentUser$.value?.id;
      if (userId === undefined) return;
      const progress: ReadProgressType = {
        userId,
        mangaId: this.mangaId,
        lastReadChapter: this.chapterId,
        lastReadPage: index,
      };
      this._readProgressService.updateProgress(progress);
    }
  }

  initializeIntersectionObserver() {
    if (!this.pagesWrapper)
      setTimeout(() => this.initializeIntersectionObserver, 1000);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imgElement = entry.target as HTMLImageElement;
          const index = Number(imgElement.getAttribute('data-index'));

          if (
            entry.isIntersecting ||
            (this.lastReadPage !== undefined && index <= this.lastReadPage)
          ) {
            if (!this.loadedImages[index]) {
              imgElement.src = this.pages[index].url;
              imgElement.onload = () => this.onImageLoad(index);
              imgElement.onerror = () => this.onImageLoad(index);
              observer.unobserve(imgElement); // Stop observing this image after loading
            }
          }
        });
      },
      { rootMargin: '100%', threshold: 0 }
    );

    this.pagesWrapper!.nativeElement.querySelectorAll('.manga-image').forEach(
      (img: Element) => observer.observe(img)
    );
  }

  onImageLoad(i: number) {
    this.loadedImages[i] = true;
    if (this.loadedImages.every((el) => el)) {
      this.isImagesLoaded = true;
    }
    if (
      this.lastReadPage !== undefined &&
      i <= this.lastReadPage &&
      this.loadedImages.slice(0, this.lastReadPage).every((el) => el)
    ) {
      this.goToLastReadPage();
    }
    this._cdr.detectChanges();
  }

  goToLastReadPage() {
    const target = this.getScrollTarget();
    if (!target) return;
    target.scrollIntoView({
      block: 'start',
    });
  }

  getScrollTarget(): HTMLElement | undefined {
    if (!this.pagesWrapper || !this.lastReadPage) return;
    return this.pagesWrapper.nativeElement.children[this.lastReadPage];
  }

  ngOnDestroy(): void {
    this.mangaSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }
}
