import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MangaService } from '../../../services/data/manga.service';
import { MangaType } from '../../../types/manga.type';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StoreItem, StoreService } from '../../../services/store.service';
import { MatSlider } from '@angular/material/slider';
import {
  MangaHttpService,
  RepositoryFindOptions,
} from '../../../services/http/manga-http.service';
import { debounceTime, Subject } from 'rxjs';

export const SortOptions: {
  display: string;
  value: { element: string; sort: 'ASC' | 'DESC' };
}[] = [
  {
    display: 'Most popular',
    value: { element: 'manga.view_count', sort: 'DESC' },
  },
  {
    display: 'Least popular',
    value: { element: 'manga.view_count', sort: 'ASC' },
  },
  { display: 'Newest', value: { element: 'manga.added_date', sort: 'DESC' } },
  { display: 'Oldest', value: { element: 'manga.added_date', sort: 'ASC' } },
  {
    display: 'Recently updated',
    value: { element: 'last_update_date', sort: 'DESC' },
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

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit, AfterViewInit {
  @Input() title?: string;
  @Input() titleNav?: { link: string; queryParams: any };
  @Input() canChangeIconSize: boolean = true;
  @Input() canLoadMore: boolean = true;
  @Input() canSearch: boolean = true;
  @Input() canSort: boolean = true;
  @Input() sortBy?: any;
  @Input() elementsPerLoad: number = 12;

  @ViewChild('sortSelect') sortSelectRef!: any;
  @ViewChild('sizeSlider') sizeSlider!: MatSlider;

  mangaList: MangaType[] = [];
  sortOptions = SortOptions;
  currentLoad = 0;
  searchString = '';
  isEverythingLoaded = false;
  isLoading: boolean = false;

  private inputSubject = new Subject<string>();

  constructor(
    private httpManga: MangaHttpService,
    private mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    // Subscribe to the inputSubject and debounce the input events
    this.inputSubject.pipe(debounceTime(500)).subscribe((inputValue) => {
      this.searchString = inputValue.trim();
      this.getElements();
    });
  }

  ngAfterViewInit() {
    if (this.canChangeIconSize) this.initSizeSlider();
    if (this.sortQueryParam) this.initSort();
    this.getElements();
  }

  getElements() {
    this.isLoading = true;
    this._cdr.detectChanges();
    let options: RepositoryFindOptions = {
      take: this.elementsPerLoad,
      skip: this.currentLoad * this.elementsPerLoad,
      order: this.sortBy ? this.sortBy : undefined,
    };
    if (this.searchString.length > 0) {
      options.where = {
        element: 'manga.name',
        value: this.searchString,
        useLike: true,
      };
    }
    this.httpManga.getMangaList(options).subscribe((res) => {
      if (!res || res.length < this.elementsPerLoad)
        this.isEverythingLoaded = true;
      this.mangaList.push(...res);
      this.currentLoad++;
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }

  loadMore() {
    if (this.isEverythingLoaded || !this.canLoadMore) return;
    this.getElements();
  }

  onSearchInput(event: any) {
    this.reset();
    this.isLoading = true;
    this.inputSubject.next(event.target.value);
  }

  private reset() {
    this.isEverythingLoaded = false;
    this.mangaList = [];
    this.currentLoad = 0;
  }

  onMangaSelect(index: number) {
    this.mangaService.selectedManga$.next(this.mangaList[index]);
    this.router.navigate(['manga', this.mangaList[index].id]);
  }

  private initSizeSlider() {
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
      String(this.sizeSlider.value)
    );
  }

  onSortValueChange(event: any) {
    this.addSortToParams(event);
    this.setTable(event);
    this.getElements();
  }

  addSortToParams(index: number) {
    const queryParams: Params = { sort: String(index) };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  setTable(index: number) {
    this.sortBy = this.sortOptions[index].value;
    this.reset();
  }

  get sortQueryParam() {
    return this.route.snapshot.queryParamMap.get('sort');
  }

  private initSort() {
    let index = Number(this.sortQueryParam);
    this.sortSelectRef.value = index;
    this.setTable(index);
    this._cdr.detectChanges();
  }
}
