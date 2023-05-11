import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MangaHttpService } from '../http/manga-http.service';
import { BehaviorSubject, catchError, EMPTY, retry, Subscription } from 'rxjs';
import { MangaType } from '../../types/manga.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MangaService implements OnInit, OnDestroy {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public displayedMangaList$ = new BehaviorSubject<MangaType[]>([]);
  public selectedManga$ = new BehaviorSubject<MangaType | undefined>(undefined);

  private _originalMangaList$ = new BehaviorSubject<MangaType[]>([]);
  private _mangaList$ = new BehaviorSubject<MangaType[]>([]);
  private _subscriptions: Subscription[] = [];

  private _searchInput = '';
  private _elementsPerPage = 14;
  private _loadedPages = 1;

  constructor(private _http: MangaHttpService, private _snackbar: MatSnackBar) {
    this.getMangaList();
  }

  ngOnInit() {}

  set searchInput(value: string) {
    this._searchInput = value;
    this.resetPagination();
    this.triggerDataChain();
  }

  get pageAmount() {
    return this._mangaList$.value.length;
  }

  get pageAmountLoaded() {
    return this._elementsPerPage * this._loadedPages;
  }

  get isEverythingLoaded() {
    return this.pageAmount <= this.pageAmountLoaded;
  }

  loadMorePages() {
    this._loadedPages++;
    this._paginateMangaList();
  }

  resetPagination() {
    this._loadedPages = 1;
  }

  triggerDataChain() {
    this._mangaList$.next(this._originalMangaList$.value);
    this._searchMangaList();
    this._paginateMangaList();
  }

  getMangaList() {
    this.isLoading$.next(true);
    let sub = this._http
      .getMangaList()
      .pipe(
        retry(3),
        catchError(() => {
          let errSnack = this._snackbar.open(
            "Can't connect to the server. Please retry, or try again later.",
            'Retry'
          );
          this.isLoading$.next(false);
          errSnack.afterDismissed().subscribe(() => {
            this.getMangaList();
          });
          return EMPTY;
        })
      )
      .subscribe((res: MangaType[]) => {
        let mangaList = res;
        for (let el of mangaList) {
          el.lastUpdateDate = new Date(el.lastUpdateDate);
          el.addedDate = new Date(el.addedDate);
        }
        this._originalMangaList$.next(mangaList);
        this.triggerDataChain();
        this.isLoading$.next(false);
      });
    this._subscriptions.push(sub);
  }

  public getManga(id: number) {
    this.isLoading$.next(true);
    let sub = this._http
      .getMangaList(id)
      .pipe(
        retry(3),
        catchError(() => {
          let errSnack = this._snackbar.open(
            "Can't connect to the server. Please retry, or try again later.",
            'Retry'
          );
          this.isLoading$.next(false);
          errSnack.afterDismissed().subscribe(() => {
            this.getManga(id);
          });
          return EMPTY;
        })
      )
      .subscribe((res: MangaType[]) => {
        if (res === null) {
        }
        let manga = res.at(0);
        if (manga) {
          manga.addedDate = new Date(manga.addedDate);
          manga.lastUpdateDate = new Date(manga.lastUpdateDate);
          this.selectedManga$.next(manga);
        }
        this.isLoading$.next(false);
      });
    this._subscriptions.push(sub);
  }

  private _searchMangaList() {
    if (this._toComparableString(this._searchInput) === '') return;
    let filteredList: MangaType[] = [];

    this._mangaList$.value.forEach((el) => {
      let isIncluded = false;
      if (this._isValueIncluded(el.name, this._searchInput)) isIncluded = true;
      if (this._isValueIncluded(el.chapterCount, this._searchInput))
        isIncluded = true;
      if (isIncluded) {
        filteredList.push(el);
      }
    });

    this._mangaList$.next(filteredList);
  }

  private _paginateMangaList() {
    let newList = this._mangaList$.value.slice(0, this.pageAmountLoaded);
    this.displayedMangaList$.next(newList);
  }

  private _isValueIncluded(value: any, filter: any) {
    switch (typeof filter) {
      case 'string':
        value = this._toComparableString(value);
        filter = this._toComparableString(filter);
        return value.includes(filter);
      case 'number':
      case 'boolean':
        return value === filter;
      default:
        return false;
    }
  }

  private _toComparableString(value: any) {
    return value.toString().trim().toLowerCase();
  }

  private _populateMangasForTesting(iterations: number) {
    if (this._originalMangaList$.value.length < 1) return;
    for (let i = 0; i < iterations; i++) {
      this._originalMangaList$.next([
        ...this._originalMangaList$.value,
        ...this._originalMangaList$.value,
      ]);
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
