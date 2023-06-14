import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manga-chapter',
  templateUrl: './manga-chapter.component.html',
  styleUrls: ['./manga-chapter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaChapterComponent implements OnInit {
  manga: MangaType | undefined = undefined;
  chapter: number = 0;
  mangaId: number = 0;
  isInitialized = {
    manga: false,
    pages: false,
  };

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

  private _getManga() {
    this.isInitialized.manga = false;
    if (
      !this._mangaService.selectedManga$.value ||
      this._mangaService.selectedManga$.value?.id !== this.mangaId
    ) {
      this._mangaHttp
        .getMangaList({
          where: [
            {
              element: 'id',
              value: this.mangaId,
            },
          ],
        })
        .subscribe((res: { list: MangaType[]; count: number }) => {
          this.manga = res.list.at(0);
          if (!this.isChapterValid) this.goToChapterSelect();
          if (
            !this.manga?.chapters[this.chapter].pages ||
            this.manga?.chapters[this.chapter].pages === []
          ) {
            this._getPages();
          }
          this.isInitialized.manga = true;
          this._cdr.detectChanges();
        });
    } else {
      this.manga = this._mangaService.selectedManga$.value;
      if (
        !this.manga?.chapters[this.chapter].pages ||
        this.manga?.chapters[this.chapter].pages === []
      ) {
        this._getPages();
      }
      this.isInitialized.manga = true;
      this._cdr.detectChanges();
    }
  }

  private _getPages() {
    this.isInitialized.pages = false;
    if (!this.manga) this.goToChapterSelect();
    this._mangaHttp
      .getMangaPages(this.manga!.id!, this.manga!.chapters[this.chapter])
      .subscribe((res) => {
        let pages = res;
        if (pages) {
          this.manga!.chapters[this.chapter].pages = pages;
        } else {
          this.goToChapterSelect();
        }
        this.isInitialized.pages = true;
        this._cdr.detectChanges();
      });
  }

  goToChapterSelect() {
    this._router.navigate(['/manga', this.mangaId]);
  }

  navigateToPreviousChapter() {
    if (this.isFirstChapter) return;
    this.chapter--;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      this._getPages();
      window.scroll({ top: 0 });
    });
  }

  navigateToNextChapter() {
    if (this.isLastChapter) return;
    this.chapter++;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      this._getPages();
      window.scroll({ top: 0 });
    });
  }

  get isFirstChapter() {
    if (!this.manga) return false;
    return this.chapter === 0;
  }

  get isLastChapter() {
    if (!this.manga) return false;
    return this.chapter === this.manga.chapters.length - 1;
  }

  get isChapterValid() {
    if (!this.manga) return false;
    return this.chapter >= 0 && this.chapter <= this.manga.chapters.length - 1;
  }

  sanitizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }
}
