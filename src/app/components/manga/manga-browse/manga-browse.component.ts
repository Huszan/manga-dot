import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { Subscription } from 'rxjs';
import { MangaType } from '../../../types/manga.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit, OnDestroy {
  mangaList: MangaType[] = [];
  isLoading: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private mangaService: MangaService,
    private router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let mangaListSub = this.mangaService.displayedMangaList$.subscribe(
      (data) => {
        this.mangaList = data;
        this._cdr.detectChanges();
      }
    );
    let loadingSub = this.mangaService.isLoading$.subscribe((data) => {
      this.isLoading = data;
      this._cdr.detectChanges();
    });
    this._subscriptions.push(mangaListSub);
    this._subscriptions.push(loadingSub);
  }

  loadMore() {
    this.mangaService.loadMorePages();
  }

  isEverythingLoaded() {
    return this.mangaService.isEverythingLoaded;
  }

  onSearchInput(event: any) {
    this.mangaService.searchInput = event.target.value;
  }

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(
      this.mangaService.displayedMangaList$.value[index]
    );
    this.router.navigate(['manga', this.mangaService.selectedManga$.value!.id]);
  }

  ngOnDestroy() {
    this.mangaService.searchInput = '';
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
