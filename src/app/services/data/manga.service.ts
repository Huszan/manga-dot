import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {MangaHttpService} from "../http/manga-http.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {IMangaForm} from "../../types/manga-form.type";

@Injectable({
  providedIn: 'root'
})
export class MangaService implements OnInit, OnDestroy {

  public isLoading$ = new BehaviorSubject<boolean>(false);
  public displayedMangaList$ = new BehaviorSubject<IMangaForm[]>([]);

  private _originalMangaList$ = new BehaviorSubject<IMangaForm[]>([]);
  private _mangaList$ = new BehaviorSubject<IMangaForm[]>([]);
  private _subscriptions: Subscription[] = [];

  private _searchInput = '';
  private _elementsPerPage = 14;
  private _loadedPages = 1;

  constructor(
    private _http: MangaHttpService
  ) {
    this._getMangaList();
  }

  ngOnInit() {
  }

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

  private _getMangaList() {
    this.isLoading$.next(true);
    let sub = this._http.getMangaList().subscribe(res => {
      let mangaList = res as IMangaForm[];
      this._originalMangaList$.next(mangaList);
      // TODO
      //  Remove line below when done with testing!
      this._populateMangasForTesting(5);
      //
      this.triggerDataChain();
      this.isLoading$.next(false);
    })
    this._subscriptions.push(sub);
  }

  private _searchMangaList() {
    if(this._toComparableString(this._searchInput) === '') return;
    let filteredList: IMangaForm[] = [];

    this._mangaList$.value.forEach(el => {
      let isIncluded = false;
      if(this._isValueIncluded(el.name, this._searchInput)) isIncluded = true;
      if(this._isValueIncluded(el.chapterCount, this._searchInput)) isIncluded = true;
      if(isIncluded) {
        filteredList.push(el);
      }
    })

    this._mangaList$.next(filteredList);
  }

  private _paginateMangaList() {
    let newList = this._mangaList$.value.slice(
      0,
      (this.pageAmountLoaded)
    );
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
    if(this._originalMangaList$.value.length < 1) return;
    for(let i = 0; i < iterations; i++) {
      this._originalMangaList$.next([...this._originalMangaList$.value, ...this._originalMangaList$.value])
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

}
