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
import { FormBuilder, FormGroup } from '@angular/forms';

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
  @Input() canSelectTags: boolean = true;
  @Input() sortBy?: any;
  @Input() elementsPerLoad: number = 12;

  @ViewChild('sortSelect') sortSelectRef!: any;
  @ViewChild('sizeSlider') sizeSlider!: MatSlider;

  mangaList: MangaType[] = [];
  sortOptions = SortOptions;
  currentLoad = 0;
  searchString = '';
  availableTags = Tags;
  isEverythingLoaded = false;
  isLoading: boolean = false;
  isTagSelectBoxOpen = false;

  checkboxForm!: FormGroup;

  private inputSubject = new Subject<string>();

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
    // Subscribe to the inputSubject and debounce the input events
    this.inputSubject.pipe(debounceTime(1000)).subscribe((inputValue) => {
      this.searchString = inputValue.trim();
      this.getElements();
    });
    this.checkboxForm = this.fb.group({});
    for (let el of this.availableTags) {
      this.checkboxForm.addControl(el, this.fb.control(false));
    }
  }

  get checkboxFormKeys() {
    return Object.keys(this.checkboxForm.controls);
  }

  ngAfterViewInit() {
    if (this.canChangeIconSize) this.initSizeSlider();
    if (this.sortQueryParam) this.initSort();
    if (this.tagsQueryParam) this.initTagSelect();
    this.getElements();
  }

  getElements() {
    this.isLoading = true;
    this._cdr.detectChanges();
    let options: RepositoryFindOptions = {
      where: [],
      take: this.elementsPerLoad,
      skip: this.currentLoad * this.elementsPerLoad,
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
    this.setSort(event);
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

  get selectedTagIndexes(): number[] {
    const indexes: number[] = [];
    this.checkboxFormKeys.forEach((key, i) => {
      if (this.checkboxForm.controls[key].value) indexes.push(i);
    });
    return indexes;
  }

  addTagsToParams() {
    let queryParams: Params = { ...this.route.snapshot.queryParams };
    if (this.selectedTagIndexes.length > 0) {
      queryParams = { ...queryParams, tags: String(this.selectedTagIndexes) };
    } else {
      delete queryParams['tags'];
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  private setSort(index: number) {
    this.sortBy = this.sortOptions[index].value;
    this.reset();
  }

  get sortQueryParam() {
    return this.route.snapshot.queryParamMap.get('sort');
  }

  private initSort() {
    let index = Number(this.sortQueryParam);
    this.sortSelectRef.value = index;
    this.setSort(index);
    this._cdr.detectChanges();
  }

  onTagsApply() {
    this.isTagSelectBoxOpen = false;
    this.addTagsToParams();
    this.reset();
    this.loadMore();
  }

  private get tagsQueryParam() {
    return this.route.snapshot.queryParamMap.get('tags');
  }

  private initTagSelect() {
    let queryValue = this.tagsQueryParam;
    if (!queryValue) return;
    let tags: any[] = queryValue.split(',');
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
}
