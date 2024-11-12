import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StoreItem, StoreService } from '../../../services/store.service';
import { MatSlider } from '@angular/material/slider';
import { MangaHttpService } from '../../../services/http/manga-http.service';
import { debounceTime, Observable, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ServerResponse } from 'src/app/types/server-response.type';
import { RepositoryFindOptions } from 'src/app/types/repository-find-options.type';

export interface SortData {
  element: string;
  sort: 'ASC' | 'DESC';
}

export const SortOptions: {
  display: string;
  value: SortData;
}[] = [
  {
    display: 'Most popular',
    value: { element: 'manga.view_count', sort: 'DESC' },
  },
  {
    display: 'Least popular',
    value: { element: 'manga.view_count', sort: 'ASC' },
  },
  {
    display: 'Newest',
    value: { element: 'manga.added_date', sort: 'DESC' },
  },
  {
    display: 'Oldest',
    value: { element: 'manga.added_date', sort: 'ASC' },
  },
  {
    display: 'Recently updated',
    value: { element: 'manga.last_update_date', sort: 'DESC' },
  },
  {
    display: 'Best rated',
    value: { element: 'manga.like_count', sort: 'DESC' },
  },
  {
    display: 'Worst rated',
    value: { element: 'manga.like_count', sort: 'ASC' },
  },
];

export const Tags = [
  'action',
  'adventure',
  'fantasy',
  'harem',
  'romance',
  'supernatural',
  'comedy',
  'shounen',
  'historical',
  'shoujo',
  'slice of life',
  'drama',
  'martial arts',
  'horror',
  'mystery',
  'psychological',
  'tragedy',
  'webtoons',
  'school life',
  'yaoi',
  'isekai',
  'seinen',
  'pornographic',
  'manhwa',
  'shounen ai',
  'cooking',
  'manhua',
  'josei',
  'smut',
  'yuri',
  'sci fi',
  'erotica',
  'mature',
  'sports',
  'mecha',
  'gender bender',
  'shoujo ai',
  'medical',
  'one shot',
  'doujinshi',
];

export interface MangaBrowseOptions {
  all?: boolean;
  canChangeIconSize?: boolean;
  canChangeDisplayType?: boolean;
  canLoadMore?: boolean;
  canSearch?: boolean;
  canSort?: boolean;
  canSelectTags?: boolean;
  canPaginate?: boolean;
}

export type ItemPerPage = 6 | 9 | 12 | 18 | 24 | 36 | 48 | 64;

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title?: string;
  @Input() titleNav?: { link: string; queryParams: any };
  @Input() actionsAllowed: MangaBrowseOptions = { all: true };
  @Input() displayType: 'tiles' | 'list' = 'tiles';
  @Input() sortBy?: SortData;
  @Input() isStaticHeight?: boolean = true;
  @Input() tags: number[] = [];
  @Input() itemsPerPage: ItemPerPage | number = 12;

  @ViewChild('sortSelect') sortSelectRef: any | undefined;
  @ViewChild('sizeSlider') sizeSlider: MatSlider | undefined;
  @ViewChild('paginator') paginator: MatPaginator | undefined;

  mangaList: MangaType[] = [];
  mangaCount: number | undefined;
  sortOptions = SortOptions;

  currentPage = 0;
  searchString = '';

  availableTags = Tags;
  itemPerPageValues: ItemPerPage[] = [6, 9, 12, 18, 24, 36, 48, 64];
  isLoading: boolean = false;
  isTagSelectBoxOpen = false;
  checkboxForm: FormGroup = this.fb.group({});

  private inputSubject = new Subject<string>();
  private paramSub!: Subscription;
  private debounceTimeout: any;

  constructor(
    private httpManga: MangaHttpService,
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private store: StoreService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchDebounce();
  }

  ngAfterViewInit() {
    this.initSubToParams();
  }

  private initializeComponent() {
    if (this.actionsAllowed.all || this.actionsAllowed.canChangeIconSize)
      this.initSizeSlider();
    if (this.actionsAllowed.all || this.actionsAllowed.canChangeDisplayType)
      this.initDisplayType();
    if (this.actionsAllowed.all || this.actionsAllowed.canSearch)
      this.initSearch();
    if (this.actionsAllowed.all || this.actionsAllowed.canPaginate)
      this.initPage();
    if (this.actionsAllowed.all || this.actionsAllowed.canPaginate)
      this.initPerPage();
    if (
      (this.actionsAllowed.all || this.actionsAllowed.canSort) &&
      this.sortQueryParam
    )
      this.initSort();
    if (
      (this.actionsAllowed.all || this.actionsAllowed.canSelectTags) &&
      this.tagsQueryParam
    )
      this.initTagSelect();
    this.getElements();
  }

  private initSubToParams() {
    this.paramSub = this.subToParams();
  }

  private subToParams() {
    return this.route.queryParamMap.subscribe(() => {
      this.tags = [];
      this.searchString = '';
      this.initCheckboxForm();
      this.initializeComponent();
      this._cdr.detectChanges();
    });
  }

  fakeArray(length: number): number[] {
    return Array.from({ length }, (_, index) => index + 1);
  }

  onPageChange(event: any) {
    this.itemsPerPage = event.pageSize as ItemPerPage;
    this.currentPage = event.pageIndex;
    this.addPageToParams().then(() => {
      this.addPerPageToParams();
    });
  }

  private initSearchDebounce() {
    this.inputSubject.pipe(debounceTime(1000)).subscribe((inputValue) => {
      this.searchString = inputValue.trim();
      this.addSearchToParams().then(() => {
        this.currentPage = 0;
        this.addPageToParams();
      });
    });
  }

  private initCheckboxForm() {
    for (let el of this.availableTags) {
      this.checkboxForm.addControl(el, this.fb.control(false));
    }
  }

  get checkboxFormKeys() {
    return Object.keys(this.checkboxForm.controls);
  }

  getElements() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.mangaList = [];
    this.isLoading = true;
    this._cdr.detectChanges();

    this.debounceTimeout = setTimeout(() => {
      this.fetchManga().subscribe((res) => {
        this.mangaList = res.data && res.data.list ? res.data.list : [];
        this.mangaCount =
          res.data && res.data.count ? res.data.count : undefined;
        this.isLoading = false;
        this._cdr.detectChanges();
      });
    }, 300);
  }

  private fetchManga(): Observable<ServerResponse> {
    let options: RepositoryFindOptions = {
      where: [],
      take: this.itemsPerPage,
      skip: this.currentPage * this.itemsPerPage,
      order: this.sortBy ? this.sortBy : undefined,
    };

    if (this.searchString.length > 0) {
      options.where?.push({
        element: 'manga.name',
        value: this.searchString,
        specialType: 'like',
      });
    }

    if (this.selectedTagIndexes.length > 0) {
      options.where?.push(...this.tagOptions);
    }

    // Return an observable from the HTTP call
    return this.httpManga.getManga(undefined, options);
  }

  onSearchInput(event: any) {
    this.mangaList = [];
    this.isLoading = true;
    this.inputSubject.next(event.target.value);
  }

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  private initSizeSlider() {
    if (!this.sizeSlider) return;
    let savedSize = Number(this.store.getItem(StoreItem.MANGA_BROWSE_SIZE));
    if (
      savedSize &&
      savedSize >= this.sizeSlider.min &&
      savedSize <= this.sizeSlider.max
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
      String(this.sizeSlider!.value)
    );
  }

  onSortValueChange(event: any) {
    this.addSortToParams(event);
    this.setSort(event);
  }

  addSortToParams(index: number) {
    const queryParams: Params = { sort: String(index) };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  get selectedTagIndexes(): number[] {
    const indexes: number[] = [];
    this.checkboxFormKeys.forEach((key, i) => {
      if (this.checkboxForm.controls[key].value) indexes.push(i);
    });
    return indexes;
  }

  addSearchToParams() {
    let queryParams: Params = { ...this.route.snapshot.queryParams };
    if (this.searchString.length > 0) {
      queryParams = { ...queryParams, search: this.searchString };
    } else {
      delete queryParams['search'];
    }
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  addPageToParams() {
    let queryParams: Params = { ...this.route.snapshot.queryParams };
    if (this.currentPage > 0) {
      queryParams = { ...queryParams, page: String(this.currentPage) };
    } else {
      delete queryParams['page'];
    }
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  addPerPageToParams() {
    let queryParams: Params = { ...this.route.snapshot.queryParams };
    if (this.itemsPerPage) {
      queryParams = { ...queryParams, perPage: String(this.itemsPerPage) };
    } else {
      delete queryParams['perPage'];
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  addTagsToParams() {
    let queryParams: Params = { ...this.route.snapshot.queryParams };
    if (this.selectedTagIndexes.length > 0) {
      queryParams = { ...queryParams, tags: String(this.selectedTagIndexes) };
    } else {
      delete queryParams['tags'];
    }
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  private setSort(index: number) {
    this.sortBy = this.sortOptions[index].value;
  }

  get sortQueryParam() {
    return this.route.snapshot.queryParamMap.get('sort');
  }

  private initSort() {
    if (!this.sortSelectRef) return;
    let index = Number(this.sortQueryParam);
    this.sortSelectRef.value = index;
    this.setSort(index);
    this._cdr.detectChanges();
  }

  onTagsApply() {
    this.isTagSelectBoxOpen = false;
    this.addTagsToParams().then(() => {
      this.currentPage = 0;
      this.addPageToParams();
    });
  }

  private get searchQueryParam() {
    return this.route.snapshot.queryParamMap.get('search');
  }

  private get pageQueryParam() {
    return this.route.snapshot.queryParamMap.get('page');
  }

  private get perPageQueryParam() {
    let perPage: any = Number(this.route.snapshot.queryParamMap.get('perPage'));
    return this.itemPerPageValues.includes(perPage)
      ? perPage
      : this.itemsPerPage;
  }

  private get tagsQueryParam() {
    return this.route.snapshot.queryParamMap.get('tags');
  }

  private initSearch() {
    let queryValue = this.searchQueryParam;
    if (!queryValue) return;
    this.searchString = queryValue;
  }

  private initPage() {
    let queryValue = Number(this.pageQueryParam);
    if (!queryValue) return;
    this.currentPage = queryValue;
  }

  private initPerPage() {
    let queryValue = Number(this.perPageQueryParam) as ItemPerPage;
    if (!queryValue) return;
    this.itemsPerPage = queryValue;
  }

  private initTagSelect() {
    let tags: any[] = [];
    if (this.tags.length > 0) {
      tags = this.tags;
    } else {
      let queryValue = this.tagsQueryParam;
      if (!queryValue) return;
      tags = queryValue.split(',');
    }

    for (let tag of tags) {
      tag = Number(tag);
      this.checkboxFormKeys.forEach((key, i) => {
        if (i === tag) this.checkboxForm.controls[key].setValue(true);
      });
    }
  }

  get selectedTags() {
    const selectedTags = [];
    for (let index of this.selectedTagIndexes) {
      selectedTags.push(this.availableTags[index]);
    }
    return selectedTags;
  }

  private get tagOptions() {
    let options: any[] = [];
    let tags = this.selectedTags;
    for (let tag of tags) {
      options.push({
        element: 'manga.tags',
        value: tag,
        specialType: 'like',
      });
    }
    return options;
  }

  private initDisplayType() {
    let displayType: 'tiles' | 'list' = this.store.getItem(
      StoreItem.MANGA_DISPLAY_TYPE
    ) as 'tiles' | 'list';
    if ((displayType && displayType === 'tiles') || displayType === 'list') {
      this.displayType = displayType;
    } else {
      this.store.setItem(StoreItem.MANGA_DISPLAY_TYPE, this.displayType);
    }
    this._cdr.detectChanges();
  }

  onDisplayTypeChange(event: any) {
    this.displayType = event.value;
    this.store.setItem(StoreItem.MANGA_DISPLAY_TYPE, this.displayType);
  }

  toggleTags() {
    this.isTagSelectBoxOpen = !this.isTagSelectBoxOpen;
    if (this.isTagSelectBoxOpen) {
      this.checkboxForm.enable();
    } else {
      this.checkboxForm.disable();
    }
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }
}
