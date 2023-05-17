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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  data = {
    isFirstChapter: false,
    isLastChapter: false,
    isInitialized: false,
  };
  pages: SafeUrl[] = [];

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
    this._getManga();
  }

  private _getMangaId() {
    this.mangaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  private _getChapter() {
    this.chapter = Number(this.route.snapshot.paramMap.get('chapter'));
  }

  private _getManga() {
    if (
      !this._mangaService.selectedManga$.value ||
      this._mangaService.selectedManga$.value?.id !== this.mangaId
    ) {
      this._mangaService
        .getManga(this.mangaId)
        .subscribe((res: MangaType[]) => {
          this.manga = res.at(0);
          this._getPages();
        });
    } else {
      this.manga = this._mangaService.selectedManga$.value;
      this._getPages();
    }
  }

  private _getPages() {
    this._mangaHttpService
      .getMangaPages(this.manga!, this.chapter)
      .subscribe((res) => {
        if (res || res.length > 0) {
          this.pages = this.sanitizePages(res);
        }
        this.data.isInitialized = true;
        this._cdr.detectChanges();
      });
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
}
