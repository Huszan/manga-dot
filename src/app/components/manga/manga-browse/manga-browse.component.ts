import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    this._subscribeToMangaList();
    this._subscribeToLoading();
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
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  private _subscribeToMangaList() {
    let sub = this.mangaService.displayedMangaList$.subscribe((res) => {
      this.mangaList = res;
      this._cdr.detectChanges();
    });
    this._subscriptions.push(sub);
  }

  private _subscribeToLoading() {
    let sub = this.mangaService.isLoading$.subscribe((res) => {
      this.isLoading = res;
      this._cdr.detectChanges();
    });
    this._subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.mangaService.searchInput = '';
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
