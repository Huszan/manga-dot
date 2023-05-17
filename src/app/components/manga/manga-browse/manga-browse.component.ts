import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreItem, StoreService } from '../../../services/store.service';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  mangaList: MangaType[] = [];
  isLoading: boolean = false;

  @ViewChild('sizeSlider') sizeSlider!: MatSlider;

  private _subscriptions: Subscription[] = [];

  constructor(
    private mangaService: MangaService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    this._subscribeToMangaList();
    this._subscribeToLoading();
  }

  ngAfterViewInit() {
    this.setUpSizeSlider();
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

  private setUpSizeSlider() {
    let savedSize = Number(this.store.getItem(StoreItem.MANGA_BROWSE_SIZE));
    if (
      savedSize &&
      savedSize > this.sizeSlider.min &&
      savedSize < this.sizeSlider.max
    ) {
      this.sizeSlider.value = savedSize;
    } else {
      this.store.setItem(
        StoreItem.MANGA_BROWSE_SIZE,
        String(this.sizeSlider.value)
      );
    }
    this._cdr.detectChanges();
  }

  onSizeSliderChange() {
    this.store.setItem(
      StoreItem.MANGA_BROWSE_SIZE,
      String(this.sizeSlider.value)
    );
  }

  ngOnDestroy() {
    this.mangaService.searchInput = '';
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
