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
  data = {
    isInitialized: false,
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
    if (
      !this._mangaService.selectedManga$.value ||
      this._mangaService.selectedManga$.value?.id !== this.mangaId
    ) {
      this._mangaHttp
        .getMangaList({
          where: { id: this.mangaId },
        })
        .subscribe((res: MangaType[]) => {
          this.manga = res.at(0);
          if (!this.isChapterValid) this.goToChapterSelect();
          this.data.isInitialized = true;
          this._cdr.detectChanges();
        });
    } else {
      this.manga = this._mangaService.selectedManga$.value;
      this.data.isInitialized = true;
      this._cdr.detectChanges();
    }
  }

  goToChapterSelect() {
    this._router.navigate(['/manga', this.mangaId]);
  }

  navigateToPreviousChapter() {
    if (this.isFirstChapter) return;
    this.chapter--;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
      window.scroll({ top: 0 });
    });
  }

  navigateToNextChapter() {
    if (this.isLastChapter) return;
    this.chapter++;
    this._router.navigate(['/manga', this.mangaId, this.chapter]).then(() => {
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
